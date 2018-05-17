import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Nav from 'reactstrap/lib/Nav';
import NavLink from 'reactstrap/lib/NavLink';
import NavItem from 'reactstrap/lib/NavItem';
import SettingsForm from './SettingsForm';
import PairingForm from '../containers/pairingForm';
import ExporterForm from '../containers/exporterForm';
import FaqForm from './FaqForm';
import LinkButton from './LinkButton';
import styles from '../styles';

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
      rows.push(<PairingForm onClose={this.props.closeSidebar} />);
    }

    rows.push(
      <SettingsForm
        onClose={this.props.closeSidebar}
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

    rows.push(<ExporterForm onClose={this.props.closeSidebar} />);

    rows.push(<FaqForm onClose={this.props.closeSidebar} />);

    return (
      <div className={`p-3 ${this.className}`}>
        <Nav navbar>
          <div className={this.titleClassName}>
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

  className = styles.css({
    backgroundColor: styles.colors.offWhite,
    height: '100%',
    hr: {
      width: '100%',
    },
  });
  titleClassName = styles.css({
    color: styles.colors.offDarkBlue,
  });
}

export default AppNavComponent;
