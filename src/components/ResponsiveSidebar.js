import React, { Component } from 'react';
import { Input, NavbarBrand, Navbar } from 'reactstrap';
import Sidebar from 'react-sidebar';
import AppNav from './AppNav';

class ResponsiveSidebar extends Component {
  state = {
    open: false,
  }

  handleOnSetOpen = (o) => {
    this.setState({ open: o });
  }

  navbarStyle = {
    flexDirection: 'row',
    alignItems: 'center'
  }

  sidebarStyles = {
    sidebar: { zIndex: 1040 },
    overlay: { zIndex: 1039 }
  }

  render() {
    return (
      <Sidebar
        sidebar={<AppNav {...this.props} onSetOpen={this.handleOnSetOpen}/>} {...this.state} onSetOpen={this.handleOnSetOpen} styles={this.sidebarStyles}>
        <Navbar full inverse sticky="top" light style={this.navbarStyle}>
          <a onClick={() => this.setState({ open: !this.state.open })}>
            <span className="navbar-toggler-icon"/>
          </a>
          <NavbarBrand className="px-2">{this.props.settings.tournamentName}</NavbarBrand>
          <div className="col-lg-3">
          <Input
            size="xl"
            type="text"
            value={this.props.searchText}
            onChange={this.props.onSearchChange}
            placeholder="Search..."
          />
          </div>
        </Navbar>
        {this.props.children}
      </Sidebar>
    );
  }
}

export default ResponsiveSidebar;
