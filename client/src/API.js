import Course from "./Course";

const getAllCourses = async () => {
  const response = await fetch("http://localhost:3001/api/exams",{
    credentials: 'include',
  });
  const coursesJson = await response.json();
  
  if (response.ok) {
    const coursesMap = coursesJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudent, c.incompatibleWith, c.preparatoryCourse));
    return coursesMap.sort((a, b) => a.name.localeCompare(b.name));
  } else throw coursesJson;
};

const getStudyPlan = async () => {
  const response = await fetch("http://localhost:3001/api/studyPlan",{
    credentials: 'include',
  });
  const coursesJson = await response.json();
  
  if (response.ok) {
    const coursesMap = coursesJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudent, c.incompatibleWith, c.preparatoryCourse));
    return coursesMap.sort((a, b) => a.name.localeCompare(b.name));
  } else throw coursesJson;
};
  
const addEnroll = async (enroll) => {
  const response = await fetch("http://localhost:3001/api/enroll",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(enroll)
  });
  const coursesJson = await response.json();
  
  if (response.ok) {
    return coursesJson;
  } else throw coursesJson;
};

const addExam = async (exam) => {
  console.log(exam)
    const response = await fetch("http://localhost:3001/api/exam",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(exam)
    });
    const coursesJson = await response.json();
    if (response.ok) {
      return coursesJson;
    } else throw coursesJson;
 
};

const addCredits = async (exam, cr) => {
    const response = await fetch("http://localhost:3001/api/credits",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({exam: exam, cr: cr})
    });
    const coursesJson = await response.json();
    if (response.ok) {
      return coursesJson;
    } else throw coursesJson;
 
};



const deleteExam = async (exam) => {
  console.log(exam)
  const response = await fetch("http://localhost:3001/api/exam",{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(exam),
  });
  const coursesJson = await response.json();
 
  if (response.ok) {
    return coursesJson;
  } else throw coursesJson;
};




const logIn = async (credentials) => {
  const response = await fetch('http://localhost:3001/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch('http://localhost:3001/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const getUserByID = async (id) => {
  const response = await fetch(`http://localhost:3001/api/user/${id}`, {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async() => {
  const response = await fetch('http://localhost:3001/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
};

const API = { getAllCourses, logIn, getUserInfo, logOut, getUserByID, addEnroll, addExam, deleteExam, getStudyPlan, addCredits};
export default API;