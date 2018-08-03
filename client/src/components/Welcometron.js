import React, { PureComponent } from 'react';
import Form from 'reactstrap/lib/Form';
import Jumbotron from 'reactstrap/lib/Jumbotron';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Label from '../blocks/Label';
import Button from '../blocks/Button';
import Container from '../blocks/Container';
import ValidatedFormGroup from './ValidatedFormGroup';
import vu from '../utils/validationUtils';
import styles from '../styles';

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
      <Jumbotron className={this.className}>
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

  className = styles.css({
    color: styles.colors.darkBlue,
    borderRadius: 0,
  });
}

export default Welcometron;
