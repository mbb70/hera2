import React, { PureComponent } from 'react';
import Form from 'reactstrap/lib/Form';
import Label from 'reactstrap/lib/Label';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ValidatedFormGroup from './ValidatedFormGroup';
import vu from '../utils/validationUtils';

class Welcometron extends PureComponent {
  state = {
    name: 'My Tournament',
  };

  handleKeyPress = (field, value) => {
    this.setState({ [field]: value });
  };

  handleGetStarted = () => {
    this.props.createTournament({
      name: this.state.name,
    });
  };

  render() {
    const tournaments = Object.entries(this.props.tournaments).sort(
      ([, v1], [, v2]) => v2 - v1
    );
    return (
      <Jumbotron>
        <Container>
          <Row>
            <Col md="9">
              <h2>Welcome to Hera2</h2>
              <subtitle>A Simple Swiss Style Tournament Manager</subtitle>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col md="6">
              {tournaments.length > 0 && (
                <div className="pb-3">
                  <Label className="d-block">Open an Existing Tournament</Label>
                  {tournaments.map(([id, name]) => (
                    <Button
                      className="mr-1"
                      key={id}
                      onClick={() => this.props.switchTournament(id)}
                    >
                      {name}
                    </Button>
                  ))}
                  <Label className="mt-3 mb-0 d-block">OR</Label>
                </div>
              )}
              <Form onSubmit={this.handleGetStarted}>
                <ValidatedFormGroup
                  field="name"
                  value={this.state.name}
                  valid={vu.notEmpty}
                  onChange={this.handleKeyPress}
                >
                  <Label>Start a New Tournament</Label>
                </ValidatedFormGroup>
                <Button disabled={!vu.notEmpty(this.state.name)} type="submit">
                  Get Started
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default Welcometron;
