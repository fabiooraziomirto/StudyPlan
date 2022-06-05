"use strict";
/* Data Access Object (DAO) module for accessing exams */

const sqlite = require("sqlite3");
const { Course } = require("./Course");
const { db } = require("./db");

// Get all films
exports.getCourses = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM exams JOIN courses WHERE exams.code = courses.codeExam";
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        let courses = [];
        // Setup last as the first internalOrder
        let last = rows[0];
        let incompatibleList = [];
        for (let row of rows) {
          if (row.code === last.code) {
            incompatibleList.push(row.incompatible);
          } else {
            const course = new Course(last.code, last.name, last.credits, last.maxStudent, last.numStudent, incompatibleList, last.preparatory);
            courses.push(course);
            // Reset
            last = row;
            incompatibleList = [];

            incompatibleList.push(row.incompatible)
          }
        }
        const course = new Course(last.code, last.name, last.credits, last.maxStudent, last.numStudent, incompatibleList, last.preparatory);

        courses.push(course);
        console.log(courses)
        resolve(courses);
      } 
    });
  });
};

exports.getStudyPlan = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT idUser, code, exams.name, exams.maxStudent, exams.credits, exams.numStudent FROM studyPlan \
    JOIN exams ON studyPlan.codeExam = exams.code\
    JOIN users ON studyPlan.idUser = users.id\
    WHERE users.id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (rows.length > 0) {
          let courses = [];
          // Setup last as the first internalOrder
          let last = rows[0];
          let incompatibleList = [];
          for (let row of rows) {
            if (row.code === last.code) {
              incompatibleList.push(row.incompatible);
            } else {
              const course = new Course(last.code, last.name, last.credits, last.maxStudent, last.numStudent, incompatibleList, last.preparatory);
              courses.push(course);
              // Reset
              last = row;
              incompatibleList = [];

              incompatibleList.push(row.incompatible)
            }
          }
          const course = new Course(last.code, last.name, last.credits, last.maxStudent, last.numStudent, incompatibleList, last.preparatory);

          courses.push(course);
      
          resolve(courses);
          
        } resolve(rows);
      }
    });
  });
};


// Insert new film
exports.addStudyPlan = (enroll, id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE users SET enroll = ? WHERE id = ?";
    db.run(
      sql,
      [enroll.enroll, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Insert new film
exports.addExam = async (body, id) => {
  console.log(body, id)
  return new Promise((resolve, reject) => {
      const sql =
      "INSERT INTO studyPlan(idUser, codeExam) VALUES(?, ?)";
      db.run(
        sql,
        [id, body.code],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
      const sqlS = "UPDATE exams SET numStudent = ? WHERE code = ?"
      db.run(
        sqlS,
        [(body.numStudent + 1), body.code],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
  });
};


exports.addCredits = async (body, id) => {
  return new Promise((resolve, reject) => {
      const sql =
      "UPDATE users SET credits = ? WHERE id = ?";
      db.run(
        sql,
        [body.cr, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
  });
};

// Update an existing film
exports.updateFilm = (film, id, userid) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE films SET title = ?, favorite = ?, date = ?, rating = ? WHERE id = ? AND user = ?";
    db.run(
      sql,
      [
        film.title,
        film.favorite,
        dayjs(film.date).isValid() ? dayjs(film.date).format("YYYY/MM/DD") : undefined,
        film.rating,
        id,
        userid
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );

  });
};

// Mark film as favorite/unfavorite
exports.markFavorite = (id, favorite, userid) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE films SET favorite = ? WHERE id = ? AND user = ?";
    db.run(sql, [favorite, id, userid], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

// Delete an existing film
exports.deleteFilm = (id, userid) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM films WHERE id=? AND user = ?";
    db.run(sql, [id, userid], (err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });
};

// Delete an existing film
exports.deleteExam = (id, body) => {

  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM studyPlan WHERE idUser = ? AND codeExam = ?";
    db.run(sql, [id, body.code], (err) => {
      if (err) reject(err);
      else resolve(null);
    });
    const sqlS = "UPDATE exams SET numStudent = ? WHERE code = ?"
      db.run(
        sqlS,
        [(body.numStudent - 1), body.code],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
  });
};

