import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Nav, NavLink, NavItem } from 'reactstrap';
import SettingsForm from './SettingsForm';
import PairingForm from '../containers/pairingForm';
import ExporterForm from '../containers/exporterForm';
import FaqForm from './FaqForm';
import LinkButton from './LinkButton';

connect();

class AppNavComponent extends PureComponent {
  closeNav = () => {
    this.props.toggleSidebar(false);
  };

  handlePairPlayers = pairs => {
    this.props.pairPlayers(pairs);
    this.props.switchView(false);
    this.closeNav();
  };

  handleFinishRound = () => {
    this.props.finishRound();
    this.props.switchView(true);
    this.closeNav();
  };

  handleSaveSettings = settings => {
    this.props.saveSettings(settings);
    this.closeNav();
  };

  handleSwitchTournament = () => {
    this.props.switchTournament();
    this.closeNav();
  };

  handleDeleteTournament = () => {
    this.props.deleteTournament(this.props.currentTournament);
    this.closeNav();
  };

  handleToggleDroppedFilter = () => {
    this.props.toggleDroppedFilter(!this.props.uiState.hideDropped);
    this.closeNav();
  };

  handleToggleSortType = () => {
    this.props.toggleSortType(!this.props.uiState.sortByScore);
    this.closeNav();
  };

  render() {
    const hasDroppedPlayers = Object.values(this.props.players).some(
      p => p.dropped
    );
    const unfinishedMatches = Object.values(this.props.matches).some(
      m => m.winner === undefined
    );
    const activeRound = this.props.activeRound !== undefined;
    const rows = [];
    if (!unfinishedMatches && activeRound) {
      rows.push(
        <LinkButton onClick={this.handleFinishRound}>Finish Round</LinkButton>
      );
    }

    if (!activeRound) {
      rows.push(
        <PairingForm
          pairPlayers={this.handlePairPlayers}
          settings={this.props.settings}
          players={this.props.players}
          onExit={this.closeNav}
        />
      );
    }

    rows.push(
      <SettingsForm
        onExit={this.closeNav}
        settings={this.props.settings}
        saveSettings={this.handleSaveSettings}
      />
    );

    if (this.props.uiState.playerView) {
      rows.push(
        <LinkButton onClick={this.handleToggleSortType}>
          {this.props.uiState.sortByScore
            ? 'Sort Alphabetically'
            : 'Sort By Score'}
        </LinkButton>
      );
    }

    if (this.props.uiState.playerView && hasDroppedPlayers) {
      rows.push(
        <LinkButton onClick={this.handleToggleDroppedFilter}>
          {this.props.uiState.hideDropped ? 'Show Dropped' : 'Hide Dropped'}
        </LinkButton>
      );
    }

    rows.push(
      <LinkButton onClick={this.handleSwitchTournament}>
        Switch Tournament
      </LinkButton>
    );

    rows.push(
      <LinkButton onClick={this.handleDeleteTournament}>
        Delete Tournament
      </LinkButton>
    );

    rows.push(<ExporterForm onExit={this.closeNav} />);

    rows.push(<FaqForm onExit={this.closeNav} />);

    return (
      <div className="p-3 app-nav">
        <Nav navbar>
          <div className="app-nav-title">
            <h5>{this.props.settings.tournamentName}</h5>
            <hr className="my-1" />
          </div>
          {rows.map((navItem, i) => (
            <NavItem key={i}>
              <NavLink tag="span">{navItem}</NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    );
  }
}

export default AppNavComponent;
