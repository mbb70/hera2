import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SettingsForm from './SettingsForm';
import PairingForm from '../containers/pairingForm';
import FaqForm from './FaqForm';
import { Button, NavLink, NavItem, Nav } from 'reactstrap';

connect();

class AppNavComponent extends PureComponent {
  closeNav = (switchView) => {
    this.props.toggleSidebar(false);
  }

  handlePairPlayers = (pairs) => {
    this.props.pairPlayers(pairs);
    this.props.switchView(false);
    this.closeNav();
  }

  handleFinishRound = () => {
    const latestRoundId = this.props.rounds
      .map(r => r.id)
      .reduce((r, a) => (r > a ? r : a), 0)
    this.props.finishRound(latestRoundId);
    this.props.switchView(true);
    this.closeNav();
  }

  handleSaveSettings = (settings) => {
    this.props.saveSettings(settings);
    this.closeNav();
  }

  handleSwitchTournament = () => {
    this.props.switchTournament();
    this.closeNav();
  }

  handleDeleteTournament = () => {
    this.props.deleteTournament(this.props.currentTournament);
    this.closeNav();
  }

  handleToggleDroppedFilter = () => {
    this.props.toggleDroppedFilter(!this.props.uiState.hideDropped);
    this.closeNav();
  }

  render() {
    const hasDroppedPlayers = Object.values(this.props.players).some(p => p.dropped);
    const unfinishedMatches = Object.values(this.props.matches).some(m => m.winner === undefined);
    const activeRound = this.props.rounds.some(r => r.active);
    return (
      <div className="p-3 app-nav">
        <Nav navbar>
          <div className="app-nav-title">
            <h5>{this.props.settings.tournamentName}</h5>
            <hr className="my-1"/>
          </div>
          <NavItem>
            <NavLink tag="span">
              {(!unfinishedMatches && activeRound) && (
                <Button color="link" onClick={this.handleFinishRound}>Finish Round</Button>
              )}
              {!activeRound && (
                <PairingForm pairPlayers={this.handlePairPlayers} settings={this.props.settings} players={this.props.players}/>
              )}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag="span">
              <SettingsForm
                settings={this.props.settings}
                saveSettings={this.handleSaveSettings}
              />
            </NavLink>
          </NavItem>
          {hasDroppedPlayers && (
            <NavItem>
              <NavLink tag="span">
                <Button onClick={this.handleToggleDroppedFilter} color="link">
                {this.props.uiState.hideDropped ? 'Show Dropped' : 'Hide Dropped'}
                </Button>
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink tag="span">
              <Button onClick={this.handleSwitchTournament} color="link">
                Switch Tournament
              </Button>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag="span">
              <Button onClick={this.handleDeleteTournament} color="link">
                Delete Tournament
              </Button>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag="span">
              <FaqForm onSubmit={this.closeNav}/>
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AppNavComponent;
