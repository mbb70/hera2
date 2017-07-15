import React, { Component } from 'react';
import { Form, FormGroup, Input, Label, Jumbotron, Button } from 'reactstrap';
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
        <h2>Welcome Hera2</h2>
        <subtitle>A Simple Swiss Tournament Manager</subtitle>
        <hr/>
        {_.map(tournaments, ([id, name]) => {
          return (
            <Button key={id} onClick={() => this.props.switchTournament(id)}>{name}</Button>
          );
        })}
        <Form onSubmit={this.handleGetStarted}>
          <ValidatedFormGroup
            field='name'
            value={this.state.name}
            valid={ValidationUtils.notEmpty}
            onChange={this.handleKeyPress}
          >
            <Label>Tournament Name</Label>
          </ValidatedFormGroup>
          {false && <FormGroup check>
            <Label check>
              <Input type="checkbox" onChange={this.handleGoogleAuth} checked={this.state.driveSync}/>{' '}
              Sync with Google Drive
            </Label>
          </FormGroup>}
          <Button disabled={this.state.signingIn} type="submit">Get Started</Button>
        </Form>
      </Jumbotron>
    );
  }
}

export default Welcometron;
