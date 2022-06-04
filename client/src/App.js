import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import { Container, Row, Alert, Button } from 'react-bootstrap';
import { LogoutButton } from './Components/AuthComponents';

import { CourseRoute, FormRoute, LoginRoute, DefaultRoute, AddListExam } from './Components/CourseViews';
import { NavbarS } from './Components/Navbar';



import API from './API';

function App() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [enrolled, setEnroll] = useState(false);
  const [exam, setExam] = useState(false);
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(0);
  const [time, setTime] = useState('');

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  const getUserInfo = async () => {
    let user = await API.getUserInfo();
    user = await API.getUserByID(user.id);
    setTime(user.enroll);
    setCredits(user.credits);
  };

  useEffect(() => {
    getUserInfo();
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkEnroll = async () => {
      const row = await API.getUserInfo(); // we have the user info here
      const user = await API.getUserByID(row.id);
      const sP = await API.getStudyPlan();
      setStudyPlan(sP);
      if (user.enroll !== null)
        setEnroll(true);
      else
        setEnroll(false);
    };
    checkEnroll();
  }, [enrolled]);

  useEffect(() => {
    getCourses();
  }, []);

  const getStudyPlan = async () => {
    const studyPlan = await API.getStudyPlan();
    setStudyPlan(studyPlan);
  };

  useEffect(() => {
    getStudyPlan();
  }, [studyPlan]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      let userM = await API.getUserByID(user.id);
      if (userM.enroll !== false)
        setEnroll(true);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  const handlePlan = async (enroll) => {
    API.addEnroll(enroll);
    setEnroll(true);
    let user = await API.getUserInfo();
    user = await API.getUserByID(user.id);
    setTime(user.enroll)
    setMessage({ msg: `You are enrolled as, ${user.enroll}!`, type: 'success' });
  };

  const addExam = async (exam) => {
    let flag = true;
    let flagP = true;
    let sP = studyPlan;
    console.log(sP)
    if (sP.length != 0){
      for (let row of sP) {
        console.log(exam.course.preparatoryCourse)
         if(exam.course.preparatoryCourse !== null) {
          if(row.code === exam.course.preparatoryCourse){
            flagP = true;
            break;
          } else {
            flagP = false;
            continue;
          }
        } if(exam.course.incompatibleWith.length > 0){
          for(let i of exam.course.incompatibleWith){
            if(row.code === i){
              setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to incopatibility!`, type: 'danger' });
              console.log("FALSE")
              flag = false;
              break;
            }
          }
        } if (row.code === exam.course.code) {
          setMessage({ msg: `You cannot add ${exam.course.name} to your study plan!`, type: 'danger' });
          console.log("FALSE")
          flag = false;
          break;
        }
      }
    } else if(exam.course.preparatoryCourse !== null){
      setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to the missing of a preparatory course!`, type: 'danger' });
      flag = false;
    } if (flag === true && flagP === true) {
      API.addExam(exam);
      let user = await API.getUserInfo();
      user = await API.getUserByID(user.id);
      setStudyPlan([...studyPlan, exam.course])
      setExam(true);

      setMessage({ msg: `You add ${exam.course.name} to your study plan!`, type: 'success' });
      setCredits(user.credits+exam.course.credits)
      await API.addCredits(exam, user.credits+exam.course.credits);
      
    } if(flagP === false) {
      setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to the missing of a preparatory course!`, type: 'danger' });
    }
  };

  const deleteExam = async (exam) => {
    
    API.deleteExam(exam);
    let user = await API.getUserInfo();
    user = await API.getUserByID(user.id);
    console.log(studyPlan.filter((a) => a.code !== exam.course.code))
    setStudyPlan(studyPlan.filter((a) => a.code !== exam.course.code))
    setCredits(user.credits-exam.course.credits)
    setExam(false);
    setMessage({ msg: `You remove ${exam.course.name} from your study plan!`, type: 'danger' });
    await API.addCredits(exam, user.credits-exam.course.credits);
  }

  return (
    <BrowserRouter>
      <Container className='App'>
        <NavbarS />
        {message && !loggedIn && !enrolled && !exam && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row>}
        {message && loggedIn && enrolled && !exam && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row>}
        {message && loggedIn && enrolled && exam && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row>}
        <Routes>

          <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginRoute login={handleLogin} />
          } />

          <Route path='/' element={loggedIn && enrolled === false && !exam && studyPlan.length === 0
            ? <CourseRoute courses={courses} enrolled={enrolled} /> :
            <AddListExam setMessage={setMessage} courses={courses} credits={credits} time={time} studyPlan={studyPlan} enrolled={enrolled} loggedIn={loggedIn} addExam={addExam} deleteExam={deleteExam} />} />

          <Route path='/enroll' element={loggedIn && enrolled === false &&
            <FormRoute handlePlan={handlePlan} />
          } />

          <Route path='*' element={<DefaultRoute />} />

        </Routes>

        {loggedIn && <LogoutButton logout={handleLogout} />}

      </Container>
    </BrowserRouter>
  );
}

export default App;
