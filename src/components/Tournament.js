import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PlayerCards from '../containers/playerCards';
import MatchCards from '../containers/matchCards';
import Welcometron from './Welcometron';
import ResponsiveSidebar from './ResponsiveSidebar';
import ErrorBoundary from './ErrorBoundary';

connect();

class TournamentComponent extends PureComponent {
  toggleSidebar = () => {
    this.props.toggleSidebar(!this.props.uiState.sidebarOpen);
  };

  render() {
    if (!this.props.settings) {
      return (
        <Welcometron
          tournaments={this.props.tournaments}
          switchTournament={this.props.switchTournament}
          createTournament={this.props.createTournament}
        />
      );
    }
    return (
      <ResponsiveSidebar
        open={this.props.uiState.sidebarOpen}
        toggleSidebar={this.toggleSidebar}
      >
        <ErrorBoundary>
          {this.props.uiState.playerView ? <PlayerCards /> : <MatchCards />}
        </ErrorBoundary>
      </ResponsiveSidebar>
    );
  }
}

export default TournamentComponent;
