import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function ExamForm(props) {
  const navigate = useNavigate();
  const location = useLocation();  
  
  // if the exam already exists we configure the form, otherwise we use default values.
  const [enroll, setEnroll] = useState(location.state ? location.state.course.enroll : '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const exam = {enroll: enroll};
    console.log(exam.enroll)
    props.handlePlan(exam);

    navigate('/');
  }

  return(
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Full Time or Part Time</Form.Label>
        <Form.Select required={true} onChange={event => setEnroll(event.target.value)}>
             <option disabled selected value> -- select an option -- </option>
            <option value='partTime'>Part Time</option>
            <option value='fullTime'>Full Time</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">Save</Button>
      &nbsp; { /* Adding a blank space between the two buttons */ }
      <Link to='/'>
        <Button variant="danger">Cancel</Button>
      </Link>
      &nbsp; 
    </Form>
  )
}

export default ExamForm;