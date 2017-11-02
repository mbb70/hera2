import React, { PureComponent } from 'react';
import {
  Form,
  Label,
  Jumbotron,
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap';
import ValidatedFormGroup from './ValidatedFormGroup';
import vu from '../utils/validationUtils';

class Welcometron extends PureComponent {
  state = {
    name: 'My Tournament',
    errorMsg: '',
    uploadedState: undefined,
  };

  handleKeyPress = (field, value) => {
    this.setState({ [field]: value });
  };

  handleGetStarted = e => {
    this.props.createTournament({
      name: this.state.name,
    });
  };

  handleUploadedState = () => {
    this.props.createTournament({
      state: this.state.uploadedState,
    });
  };

  handleJsonUpload = e => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const uploadedState = JSON.parse(e.target.result);
        const requiredKeys = ['players', 'matches', 'rounds', 'tournamentName'];
        const missingKeys = requiredKeys.filter(
          k => uploadedState[k] === undefined
        );
        if (missingKeys.length > 0) {
          this.setState({
            uploadMsg:
              "Your file could not be uploaded! The following required fields are missing: '" +
              missingKeys.join("', '") +
              "'.",
          });
        } else {
          this.setState({ uploadMsg: '', uploadedState });
        }
      } catch (ex) {
        this.setState({
          uploadMsg:
            'Your file could not be uploaded! Please check the format.',
        });
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  render() {
    const tournaments = Object.entries(this.props.tournaments).sort(
      ([k1, v1], [k2, v2]) => v2 - v1
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
                  {tournaments.map(([id, name]) => {
                    return (
                      <Button
                        className="mr-1"
                        key={id}
                        onClick={() => this.props.switchTournament(id)}
                      >
                        {name}
                      </Button>
                    );
                  })}
                  <Label className="mt-3 mb-0 d-block">OR</Label>
                </div>
              )}
              {false && (
                <div className="pb-3">
                  <Label className="d-block">Import a Tournament</Label>
                  <input
                    type="file"
                    name="files[]"
                    accept="application/json,.json"
                    onChange={this.handleJsonUpload}
                  />
                  {this.state.errorMsg !== '' && (
                    <Label>{this.state.errorMsg}</Label>
                  )}
                  {this.state.uploadedState && (
                    <div>
                      <Label>Upload Successful!</Label>
                      <div>
                        <Button
                          type="button"
                          onClick={this.handleUploadedState}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  )}
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
