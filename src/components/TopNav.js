import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import Navbar from 'reactstrap/lib/Navbar';
import Label from '../blocks/Label';
import ValidatedInput from './ValidatedInput';
import LinkButton from './LinkButton';
import styles from '../styles';

connect();

class TopNavComponent extends PureComponent {
  handleSearchChange = (field, value) => {
    this.props.updateSearch(value.trim());
  };

  handleSwitchView = () => {
    this.props.switchView(!this.props.uiState.playerView);
  };

  render() {
    return (
      <Navbar full inverse sticky="top" light className={this.className}>
        <LinkButton onClick={this.props.openSidebar}>
          <span className="navbar-toggler-icon" />
        </LinkButton>
        <NavbarBrand className="px-2 d-sm-block d-none">
          {this.props.settings.tournamentName}
        </NavbarBrand>
        <div className="col-lg-3">
          <ValidatedInput
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

  className = styles.css({
    backgroundColor: styles.colors.darkBlue,
    flexDirection: 'row',
    justifyContent: 'left',
    flexWrap: 'initial',
    '.bold-nav-label': {
      color: 'grey',
      fontWeight: 'bold',
      fontSize: '1.4rem',
      marginBottom: 0,
    },
    '.navbar-brand': {
      marginRight: 0,
    },
    '.nav-label-xs': {
      position: 'relative',
      top: '-0.1rem',
    },
    '.navbar-toggler-icon': {
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\") !important;",
    },
    '.arrow-icon': {
      width: 25,
      height: 25,
    },
    '.next-arrow-icon': {
      float: 'right',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='grey' viewBox='0 0 8 8'%3E%3Cpath d='M1.5 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E\")",
    },
    '.prev-arrow-icon': {
      float: 'left',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='grey' viewBox='0 0 8 8'%3E%3Cpath d='M4 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E\")",
    },
  });
}

export default TopNavComponent;
