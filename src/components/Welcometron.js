import React, { Component } from 'react';
import { Form, FormGroup, Input, Label, Jumbotron, Button, Container, Row, Col } from 'reactstrap';
import _ from 'lodash';
import ValidatedFormGroup from './ValidatedFormGroup';
import ValidationUtils from '../utils/validationUtils';
import DriveUtils from '../utils/driveUtils';

class Welcometron extends Component {
  state = {
    name: 'My Tournament',
    driveSync: false,
    signingIn: false,
  }

  handleKeyPress = (value, field) => {
    this.setState({ [field]: value });
  }

  handleLoadFromDrive = (e) => {
  }

  handleGetStarted = (e) => {
    if (this.state.driveSync) {
      DriveUtils.generateSyncId().then((syncId) => {
        this.props.getStarted({...this.state, syncId });
      });
    } else {
      this.props.getStarted(this.state);
    }
    e.preventDefault();
  }

  handleGoogleAuth = (e) => {
    const checked = e.target.checked;
    this.setState({ driveSync: checked });
    if (checked && !this.state.signedIn) {
      this.setState({ signingIn: true });
      DriveUtils.googleOauthSignIn(this.state);
    }
  }

  componentDidMount = () => {
    const inAuthCallback = window.location.pathname === '/auth/callback';
    const accessToken = DriveUtils.getAccessToken();
    this.setState({ signedIn: !!accessToken });
    if (inAuthCallback) {
      const response = DriveUtils.parseAuthResponse(window.location.hash);
      if (response.error) {
        this.setState({
          driveSync: false,
          name: decodeURIComponent(response.state),
        });
      } else {
        DriveUtils.setAccessToken(response.access_token);
        this.setState({
          signedIn: true,
          driveSync: true,
          name: decodeURIComponent(response.state),
        });
      }
      window.history.replaceState({}, null, window.location.origin);
    }
  }

  render() {
    const tournaments = _.sortBy(_.toPairs(this.props.tournaments), ([k, v]) => v);
    return (
      <Jumbotron>
        <Container>
          <Row>
            <Col md='9'>
              <h2>Welcome to Hera2</h2>
              <subtitle>A Simple Swiss Style Tournament Manager</subtitle>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col md='6'>
              {tournaments.length > 0 && (
                <div className="pb-3">
                  <Label className="d-block">Open an Existing Tournament</Label>
                  {_.map(tournaments, ([id, name]) => {
                    return (
                      <Button className="mr-1" key={id} onClick={() => this.props.switchTournament(id)}>{name}</Button>
                    );
                  })}
                  <Label className="mt-3 mb-0 d-block">OR</Label>
                </div>
              )}
              <Form onSubmit={this.handleGetStarted}>
                <ValidatedFormGroup
                  field='name'
                  value={this.state.name}
                  valid={ValidationUtils.notEmpty}
                  onChange={this.handleKeyPress}
                >
                  <Label>Start a New Tournament</Label>
                </ValidatedFormGroup>
                {false && <FormGroup check>
                  <Label check>
                    <Input type="checkbox" onChange={this.handleGoogleAuth} checked={this.state.driveSync}/>{' '}
                    Sync with Google Drive
                  </Label>
                </FormGroup>}
                <Button disabled={this.state.signingIn} type="submit">Get Started</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default Welcometron;
