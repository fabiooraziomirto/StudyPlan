import { useState } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';

function PlanButton(props) {
    return(
      <Row>
        <Col>
          <Button variant="outline-primary" onClick={props.createPlan}>Create Plan</Button>
        </Col>
      </Row>
    )
}

export { PlanButton };
