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

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  const getStudyPlan = async () => {
    const studyPlan = await API.getStudyPlan();
    setStudyPlan(studyPlan);
  };

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

  useEffect(() => {
    getStudyPlan();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      let userM = await API.getUserByID(user.id);
      if (userM.enroll !== false)
        setEnroll(true)
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
    setMessage({ msg: `You are enrolled as, ${user.enroll}!`, type: 'success' });
  };

  const addExam = async (exam) => {
    let flag = true;
    let sP = studyPlan;
    console.log(sP);
    if (sP != undefined) {
      for (let row of sP) {
        console.log(row.code, exam.course.code);
        if (row.code === exam.course.code) {
          setMessage({ msg: `You cannot add ${exam.course.name} to your study plan!`, type: 'danger' });
          console.log("FALSE")
          flag = false;
          break;
        }
      }
    } if (flag === true) {
      console.log(flag)
      API.addExam(exam);

      setStudyPlan([...studyPlan, exam])
      setExam(true);

      setMessage({ msg: `You add ${exam.course.name} to your study plan!`, type: 'success' });
    }
  };

  const deleteExam = (exam) => {

    API.deleteExam(exam);

    setExam(false);

    setMessage({ msg: `You remove ${exam.course.name} from your study plan!`, type: 'danger' });
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

          <Route path='/' element={loggedIn && enrolled === false
            ? <CourseRoute courses={courses} enrolled={enrolled} /> :
            <AddListExam courses={courses} studyPlan={studyPlan} enrolled={enrolled} loggedIn={loggedIn} addExam={addExam} deleteExam={deleteExam} />} />

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
