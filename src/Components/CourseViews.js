import { Container, Row, Col } from 'react-bootstrap';
import { LoginForm } from './AuthComponents';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import CourseTable from './CourseTable';
import ExamForm from './CourseForm';

function DefaultRoute() {
  return(
    <Container className="vh-100">
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
    </Container>
  );
}

function CourseRoute(props) {
  return(
    <Container className="vh-100">
      <Row >
        <Col>
          <CourseTable courses={props.courses} enrolled={props.enrolled} loggedIn={props.loggedIn}/>
        </Col>
      </Row>
    </Container>
  );
}

function FormRoute(props) {
  return(
    <Container className="vh-100">
      <Row>
        <Col>
          <h1>New Study Plan</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ExamForm handlePlan={props.handlePlan} />
        </Col>
      </Row>
    </Container>
  );
}

function AddListExam(props) {
  const location = useLocation();
  const [studyPlan, setStudyPlan] = useState(location.state ? location.state.course : '');
  const [studyPlanP, deleteStudyPlan] = useState(location.state ? location.state.course : '');

  const handleSubmit = (event) => {

    event.preventDefault();
    
    const studyPlan = { studyPlan: props.studyPlan };
    
    props.saveStudyPlan(studyPlan.studyPlan);

  }

  const handleDelete = (event) => {

    event.preventDefault();
    
    const studyPlan = { studyPlan: props.studyPlan };
    
    props.deleteStudyPlan(studyPlan.studyPlan);

  }

  if(props.loggedIn === true && props.studyPlan.length > 0){
    return(
      <Container className="something">
        <Row>
        <Col  md={6}>
            <CourseTable courses={props.courses} constraint={props.constraint} enrolled={props.enrolled} addExam={props.addExam} deleteExam={props.deleteExam}/>
          </Col>
          <Col>
            <CourseTable saveStudyPlan={props.saveStudyPlan} deleteStudyPlan={props.deleteStudyPlan} setMessage={props.setMessage} constraint={props.constraint} courses={props.studyPlan} enrolled={props.enrolled} time={props.time} loggedIn={props.loggedIn} addExam={props.addExam} deleteExam={props.deleteExam}/>
            <Row>
          
          <p>Number of credits: {props.credits}</p> <p>Number of remain credits: {props.time === 'partTime' ? 40-props.credits : 80-props.credits}</p>
          <Col  md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group role="form">
              <Button className="btn btn-primary btn-large centerButton" type="submit" value={props.courses} onChange={event => setStudyPlan(event.target.value)}>Send</Button>
              &nbsp; { /* adding a blank space between the two buttons */}
            </Form.Group>
          </Form>
        </Col>
        <Col>
        <Form onSubmit={handleDelete}>
          <Form.Group role="form">
            <Button className="btn btn-danger btn-large centerButton" type="submit" value={props.courses} onChange={event => deleteStudyPlan(event.target.value)}>Delete</Button>
            &nbsp; { /* adding a blank space between the two buttons */}
          </Form.Group>
        </Form>
        </Col>
        
      </Row>
          </Col>
          
        </Row>
       
      </Container>
    );
  } else {
    return(
      <Container className='App'>
        <Row>
          <Col>
            <CourseTable courses={props.courses} constraint={props.constraint} enrolled={props.enrolled} addExam={props.addExam} deleteExam={props.deleteExam}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

function LoginRoute(props) {
  return(
    <>
      <Row>
        <Col>
          <h1>Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.login} />
        </Col>
      </Row>
    </>
  );
}


export { CourseRoute, DefaultRoute, LoginRoute, FormRoute, AddListExam };