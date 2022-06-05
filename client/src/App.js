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
  const [student, setStudent] = useState(0);
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(0);
  const [time, setTime] = useState('');
  const [constraint, setConstraint] = useState([]);

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
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      let userM = await API.getUserByID(user.id);
      
      if (userM.enroll !== null)
        setEnroll(true);
      else
        setEnroll(false)
      console.log(userM, enrolled)
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

  const getConstraint = async (exam) => {
    let sP = studyPlan;
    if (sP.length != 0) {
      for (let row of sP) {
          /*if (c.preparatoryCourse !== null) {
            if (row.code === c.preparatoryCourse) {
              break;
            } else {
              continue;
            }
          } */if (exam.incompatibleWith.length > 0) {
          for (let i of exam.incompatibleWith) {
            if (row.code === i) {
              setConstraint([...constraint, i]);
              break;
            }
          }
        }
      }
    } if (exam.incompatibleWith.length > 0) {
      for (let i of exam.incompatibleWith) {
        setConstraint([...constraint, i]);
      }
    }
  }


  const addExam = async (exam) => {
    let flag = true;
    let flagP = true;
    let sP = studyPlan;
    console.log(exam);
    if (sP.length != 0) {
      for (let row of sP) {
        if (exam.course.preparatoryCourse !== null) {
          if (row.code === exam.course.preparatoryCourse) {
            flagP = true;
            break;
          } else {
            flagP = false;
            continue;
          }
        } if (exam.course.incompatibleWith.length > 0) {
          for (let i of exam.course.incompatibleWith) {
            if (row.code === i) {
              setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to incopatibility!`, type: 'danger' });
              flag = false;
              break;
            }
          }
        } if (row.code === exam.course.code) {
          setMessage({ msg: `You cannot add ${exam.course.name} to your study plan!`, type: 'danger' });
          flag = false;
          break;
        }
      }
    } else if (exam.course.preparatoryCourse !== null) {
      setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to the missing of a preparatory course!`, type: 'danger' });
      flag = false;
    } if(exam.course.numStudent >= exam.course.maxStudent){
      setMessage({ msg: `You cannot add ${exam.name} to your study plan. Max number of student reached!`, type: 'danger' });
      flag = false;
    } if (flag === true && flagP === true) {
      //API.addExam(exam);
      let user = await API.getUserInfo();
      user = await API.getUserByID(user.id);
      setConstraint([constraint.push(exam.course.code)]);
      await getConstraint(exam.course);
      setStudyPlan([...studyPlan, exam.course])
      setExam(true);

      setMessage({ msg: `You add ${exam.course.name} to your study plan!`, type: 'success' });
      setCredits(user.credits + exam.course.credits)
      //await API.addCredits(exam, user.credits+exam.course.credits);

    } if (flagP === false) {
      setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to the missing of a preparatory course!`, type: 'danger' });
    }
  };

  const deleteConstraint = async () => {
    let co = courses;
    let sP = studyPlan;
    let flag = true;
    let flagP = true;
    if (sP.length != 0) {
      for (let row of sP) {
        for (let c of co) {
          if (row.code === c.code) {
            flag = false;
            setConstraint(constraint.filter((a) => a.code !== c.code));
            break;
          }
        }
      }
    }
  }

  const deleteExam = async (exam) => {
    let flagP = true;
    for (let row of studyPlan) {
      if (exam.course.preparatoryCourse === null || row.code === exam.course.preparatoryCourse) {
        //API.deleteExam(exam);
        let user = await API.getUserInfo();
        user = await API.getUserByID(user.id);
        deleteConstraint();
        let sP = studyPlan.filter((a) => a.code !== exam.course.code);
        setStudyPlan(sP)
        setCredits(user.credits - exam.course.credits)
        setExam(false);
        setMessage({ msg: `You remove ${exam.course.name} from your study plan!`, type: 'danger' });
        //await API.addCredits(exam, user.credits-exam.course.credits);
      } else {
        if (row.code === exam.course.preparatoryCourse) {
          flagP = true;
          break;
        } else {
          flagP = false;
          continue;
        }

      }
      if (flagP === false) {
        setMessage({ msg: `You cannot add ${exam.course.name} to your study plan due to the missing of a preparatory course!`, type: 'danger' });
      }
    }

  }

  const saveStudyPlan = async (sP) => {
    let user = await API.getUserInfo();
    user = await API.getUserByID(user.id);
    console.log(user);
    let sPs = await API.getStudyPlan();
    console.log(sPs)
    for (let row of sP) {
      let flag = false;
      if (sPs.length !== 0) {
        for (let r of sPs) {
          if (row.code === r.code){
            flag = true;
          } 
        }
      } if(flag === false){
       
          await API.addExam(row, user);
          await API.addCredits(row, user.credits + row.credits);
        
        
      } 
    }
    console.log(sP)
  };

  const deleteStudyPlan = async (sP) => {
    let user = await API.getUserInfo();
    user = await API.getUserByID(user.id);
    
    for (let row of sP) {
      console.log(row)
        await API.deleteExam(row);
        await API.addCredits(row, 0);
    }
    setStudyPlan([])
  };

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

          <Route path='/enroll' element={loggedIn && enrolled === false &&
            <FormRoute handlePlan={handlePlan} />
          } />

          <Route path='/' element={loggedIn && enrolled === false && !exam && studyPlan.length === 0
            ? <CourseRoute courses={courses} enrolled={enrolled} loggedIn={loggedIn}/> :
            <AddListExam setMessage={setMessage} constraint={constraint}
              courses={courses} credits={credits} time={time}
              studyPlan={studyPlan} enrolled={enrolled}
              loggedIn={loggedIn} addExam={addExam} deleteExam={deleteExam}
              saveStudyPlan={saveStudyPlan} deleteStudyPlan={deleteStudyPlan}/>} />

         

          <Route path='*' element={<DefaultRoute />} />

        </Routes>

        {loggedIn && <LogoutButton logout={handleLogout} />}

      </Container>
    </BrowserRouter>
  );
}

export default App;
