import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { Table, Col, Container, Row } from 'react-bootstrap';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'


function CourseTable(props) {
  if ((props.enrolled === false || props.enrolled === undefined) && props.loggedIn === true) {
    return (
      <>
       <div className="d-grid gap-2">
        <Link to='/enroll'>
          <Button variant="primary" size="lg">Create Study Plan</Button>
        </Link>
      </div>
        <Container>
          <Row>
            <Col>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.courses.map((ex) =>
                      <CourseRow course={ex} enrolled={props.enrolled} addExam={props.addExam}  deleteExam={props.deleteExam}/>)
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Container>
          <Row>
            <Col>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>Button</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.courses.map((ex) =>
                      <CourseRow course={ex} enrolled={props.enrolled} addExam={props.addExam}  deleteExam={props.deleteExam}/>)
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

function CourseRow(props) {

  if (props.enrolled !== false || props.enrolled !== undefined) {
    return (
      <tr>
        <CourseData course={props.course} />
        <CourseAction courses={props.course} addExam={props.addExam} deleteExam={props.deleteExam}/>
      </tr>
    );
  } else {
    return (
      <tr>
        <CourseData course={props.course} />

      </tr>
    );
  }
}




function CourseData(props) {
  return (
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Description
          </Accordion.Header>
          <Accordion.Body>
            {(props.course.incompatibleWith[0] !== null) ? " Incomaptible with " + props.course.incompatibleWith : " "}
            {(props.course.preparatoryCourse !== null) ? " Preparatory course is " + props.course.preparatoryCourse : " "}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  );
}


function CourseAction(props) {
  //console.log(props)
  const navigate = useNavigate();
  const location = useLocation();

  // if the exam already exists we configure the form, otherwise we use default values.
  const [exam, setExam] = useState(location.state ? location.state.course : '');
  const [delExam, deleteExam] = useState(location.state ? location.state.course : '');


  const handleDelete = (event) => {
    event.preventDefault();

    const exam = { course: props.courses };

    props.deleteExam(exam);

  }

  const handleSubmit = (event) => {

    event.preventDefault();

    const exam = { course: props.courses }

    props.addExam(exam);

  }

  return (
    <>
      <td>
        <Form onSubmit={handleSubmit}>
          <Form.Group role="form">
            <Button className="btn btn-primary btn-large centerButton" type="submit" value={props.courses} onChange={event => setExam(event.target.value)}>Send</Button>
            &nbsp; { /* adding a blank space between the two buttons */}
            
          </Form.Group>
        </Form>
        <Form onSubmit={handleDelete}>
          <Form.Group role="form">
          &nbsp; { /* adding a blank space between the two buttons */}
          <Button className="btn btn-primary btn-large centerButton" type="submit" variant='danger' value={props.courses} onChange={event => deleteExam(event.target.value)}><i className='bi bi-trash3'></i></Button>
          </Form.Group>
        </Form>
        

      </td>
    </>

  );
}

export default CourseTable;