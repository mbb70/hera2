import React, { Component } from 'react';
import _ from 'lodash';
import SettingsForm from './SettingsForm';
import { Button, NavLink, NavItem, Nav } from 'reactstrap';
import shuffle from 'lodash/shuffle';

class AppNav extends Component {
  handlePairPlayers = () => {
    const activePlayers = _.pickBy(this.props.players, p => !(p.deleted || p.dropped));
    this.props.pairPlayers(shuffle(_.keys(activePlayers)));
    this.props.onSetOpen(false);
  }

  handleSaveSettings = (settings) => {
    this.props.saveSettings(settings);
    this.props.onSetOpen(false);
  }

  handleSwitchTournament = () => {
    this.props.switchTournament();
    this.props.onSetOpen(false);
  }

  handleNewTournament = () => {
    this.props.newTournament();
    this.props.onSetOpen(false);
  }

  handleDeleteTournament = () => {
    this.props.deleteTournament(this.props.currentTournament);
    this.props.onSetOpen(false);
  }

  handleToggleDroppedFilter = () => {
    this.props.toggleDroppedFilter(!this.props.uiState.hideDropped);
    this.props.onSetOpen(false);
  }

  render() {
    const hasDroppedPlayers = _.some(this.props.players, (p) => p.dropped);
    return (
      <div className="p-3" style={{backgroundColor: 'white', height: '100%'}} >
        <Nav navbar>
          <NavItem>
            <NavLink tag="span">
              <Button color="link" onClick={this.handlePairPlayers}>Pair Players</Button>
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
        </Nav>
      </div>
    );
  }
}

export default AppNav;
