import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Navbar from 'reactstrap/lib/Navbar';
import LinkButton from './LinkButton';

connect();

class TopNavComponent extends PureComponent {
  handleSearchChange = e => {
    this.props.updateSearch(e.target.value.trim());
  };

  handleSwitchView = () => {
    this.props.switchView(!this.props.uiState.playerView);
  };

  navbarStyle = {
    flexDirection: 'row',
    justifyContent: 'left',
    flexWrap: 'initial',
  };

  render() {
    return (
      <Navbar full inverse sticky="top" light style={this.navbarStyle}>
        <LinkButton onClick={this.props.toggleSidebar}>
          <span className="navbar-toggler-icon" />
        </LinkButton>
        <NavbarBrand className="px-2 d-sm-block d-none">
          {this.props.settings.tournamentName}
        </NavbarBrand>
        <div className="col-lg-3">
          <Input
            size="xl"
            type="text"
            value={this.props.uiState.searchText}
            onChange={this.handleSearchChange}
            placeholder="Search..."
          />
        </div>
        {this.props.rounds.length > 0 && (
          <LinkButton
            onClick={this.handleSwitchView}
            className="d-flex ml-auto"
          >
            <Label className="bold-nav-label d-sm-block d-none">
              {this.props.uiState.playerView ? 'Matches' : 'Players'}
            </Label>
            <Label className="bold-nav-label d-sm-none mr-2 nav-label-xs">
              {this.props.uiState.playerView ? 'M' : 'P'}
            </Label>
            <span className="arrow-icon next-arrow-icon d-sm-block d-none ml-2 my-1" />
            <span className="arrow-icon next-arrow-icon d-sm-none" />
          </LinkButton>
        )}
      </Navbar>
    );
  }
}

export default TopNavComponent;
