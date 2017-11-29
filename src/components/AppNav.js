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
        <LinkButton onClick={this.props.finishRound}>Finish Round</LinkButton>
      );
    }

    if (!activeRound) {
      rows.push(<PairingForm onExit={this.closeNav} />);
    }

    rows.push(
      <SettingsForm
        onExit={this.closeNav}
        settings={this.props.settings}
        saveSettings={this.props.saveSettings}
      />
    );

    if (this.props.uiState.playerView) {
      rows.push(
        <LinkButton onClick={this.props.toggleSortType}>
          {this.props.uiState.sortByScore
            ? 'Sort Alphabetically'
            : 'Sort By Score'}
        </LinkButton>
      );
    }

    if (this.props.uiState.playerView && hasDroppedPlayers) {
      rows.push(
        <LinkButton onClick={this.props.toggleDroppedFilter}>
          {this.props.uiState.hideDropped ? 'Show Dropped' : 'Hide Dropped'}
        </LinkButton>
      );
    }

    rows.push(
      <LinkButton onClick={this.props.clearTournament}>
        Switch Tournament
      </LinkButton>
    );

    rows.push(
      <LinkButton onClick={this.props.deleteTournament}>
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
