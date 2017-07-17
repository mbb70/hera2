import React, { Component } from 'react';
import { Label, Input, NavbarBrand, Navbar } from 'reactstrap';

class TopNav extends Component {
  navbarStyle = {
    flexDirection: 'row',
    alignItems: 'center'
  }

  render() {
    return (
      <Navbar full inverse sticky="top" light style={this.navbarStyle}>
        <a onClick={this.props.onToggle}>
          <span className="navbar-toggler-icon"/>
        </a>
        <NavbarBrand className="px-2 hidden-xs-down">{this.props.settings.tournamentName}</NavbarBrand>
        <div className="col-lg-3">
          <Input
            size="xl"
            type="text"
            value={this.props.searchText}
            onChange={this.props.onSearchChange}
            placeholder="Search..."
          />
        </div>
        {
          //<a onClick={this.props.onToggle} style={{display: 'flex', marginLeft: 'auto'}}>
            //<Label className="bold-nav-label hidden-xs-down">Matches</Label>
            //<span className="arrow-icon next-arrow-icon"/>
          //</a>
        }
      </Navbar>
    );
  }
}

export default TopNav;
