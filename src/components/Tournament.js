import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayerCards from './PlayerCards';
import Welcometron from './Welcometron';
import ResponsiveSidebar from './ResponsiveSidebar';

connect();

class TournamentComponent extends Component {
  state = {
    searchText: '',
  }

  handleSearchChange = (e) => {
    this.setState({searchText: e.target.value.trim()})
  }

  handleGetStarted = (tournament) => {
    this.props.createTournament(tournament);
  }

  render() {
    if (this.props.settings.newTournament) {
      return (<Welcometron getStarted={this.handleGetStarted}/>);
    } else {
      return (
        <ResponsiveSidebar {...this.props} searchText={this.state.searchText} onSearchChange={this.handleSearchChange}>
          <PlayerCards {...this.props} searchText={this.state.searchText}/>
        </ResponsiveSidebar>
      );
    }
  }
}

export default TournamentComponent;
