import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import AppNav from './AppNav';
import TopNav from './TopNav';

class ResponsiveSidebar extends Component {
  state = {
    open: false,
  }

  handleOnSetOpen = (o) => {
    this.setState({ open: o });
  }

  sidebarStyles = {
    sidebar: { zIndex: 1040 },
    overlay: { zIndex: 1039 }
  }

  render() {
    return (
      <Sidebar
        sidebar={<AppNav {...this.props} onSetOpen={this.handleOnSetOpen}/>} open={this.state.open} onSetOpen={this.handleOnSetOpen} styles={this.sidebarStyles}>
        <TopNav {...this.props} onToggle={() => this.setState({ open: !this.state.open })} />
        {this.props.children}
      </Sidebar>
    );
  }
}

export default ResponsiveSidebar;
