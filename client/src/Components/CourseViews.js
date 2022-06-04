import { Container, Row, Col } from 'react-bootstrap';
import { LoginForm } from './AuthComponents';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CourseTable from './CourseTable';
import ExamForm from './CourseForm';

function DefaultRoute() {
  return(
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
    </Container>
  );
}

function CourseRoute(props) {
  return(
    <Container className='App'>
      <Row>
        <Col>
          <CourseTable courses={props.courses} enrolled={props.enrolled} />
        </Col>
      </Row>
    </Container>
  );
}

function FormRoute(props) {
  return(
    <Container className='App'>
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
  if(props.loggedIn === true && props.studyPlan.length > 0){
    return(
      <Container className='App'>
        <Row>
          <Col>
            <CourseTable setMessage={props.setMessage} courses={props.studyPlan} enrolled={props.enrolled} time={props.time} loggedIn={props.loggedIn} addExam={props.addExam} deleteExam={props.deleteExam}/>
          </Col>
        </Row>
        <Row>
          <p>Number of credits: {props.credits}</p> <p>Number of remain credits: {props.time === 'partTime' ? 40-props.credits : 80-props.credits}</p>
          <Link to="/">
          <Button onClick={() => props.setMessage('')}>
            Save
            </Button> 
            </Link>
        </Row>
        <Row>
          <Col>
            <CourseTable courses={props.courses} enrolled={props.enrolled} addExam={props.addExam} deleteExam={props.deleteExam}/>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return(
      <Container className='App'>
        <Row>
          <Col>
            <CourseTable courses={props.courses} enrolled={props.enrolled} addExam={props.addExam} deleteExam={props.deleteExam}/>
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