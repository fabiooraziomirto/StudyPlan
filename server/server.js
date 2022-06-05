"use strict";

const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const morgan = require("morgan");
const dao = require("./course-dao");
const userDao = require('./user-dao');
const cors = require("cors");

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// set up and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Passport setup
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

/*** APIs ***/

// Authentication API

// POST /api/sessions (calls the local strategy function)
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// Films APIS

// GET /api/films
app.get("/api/exams",(request, response) => {
  dao
    .getCourses(request.user?.id)
    .then((films) => response.status(200).json(films))
    .catch(() => response.status(500).end());
});

// GET /api/films/:id
app.get("/api/films/:id", (request, response) => {
  const id = request.params.id;
  dao
    .getFilmByID(id)
    .then((films) => response.status(200).json(films))
    .catch(() => response.status(500).end());
});

// GET /api/user
app.get("/api/user/:id", (request, response) => {
  const id = request.params.id;
  userDao
    .getUserByID(id)
    .then((films) => response.status(200).json(films))
    .catch(() => response.status(500).end());
});

// GET /api/films/filter/:type
// (the url /api/films/:filter doesn't work because it matches /api/films/:id)
app.get("/api/studyPlan", isLoggedIn, (request, response) => {
  const id = request.user?.id;
  dao
    .getStudyPlan(id)
    .then((sP) => response.status(200).json(sP))
    .catch(() => response.status(500).end());
});

// POST /api/film
app.post("/api/enroll", isLoggedIn, (request, response) => {
  const id = request.user?.id;
  dao
    .addStudyPlan(request.body, id)
    .then(() => response.status(200).end())
    .catch(() => response.status(500).end());
});

app.post("/api/credits", isLoggedIn, (request, response) => {
  const id = request.user?.id;
 
  dao
    .addCredits(request.body, id)
    .then(() => response.status(200).end())
    .catch(() => response.status(500).end());
});

// POST /api/exam
app.post("/api/exam", isLoggedIn, (request, response) => {
  const id = request.user?.id;
  dao
    .addExam(request.body.exam, request.body.user.id)
    .then(() => response.status(200).end())
    .catch(() => response.status(500).end());
});


// DELETE /api/films/:id
app.delete("/api/exam", isLoggedIn, async (req, res) => {
  const id = req.user?.id;
  try {
    await dao.deleteExam(id, req.body.exam);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: `Database error while updating ${id}.` });
  }
});

// activate the server
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);
