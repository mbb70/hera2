import React, { PureComponent } from 'react';
import Sidebar from 'react-sidebar';
import AppNav from '../containers/appNav';
import TopNav from '../containers/topNav';

class ResponsiveSidebar extends PureComponent {
  sidebarStyles = {
    sidebar: { zIndex: 1040 },
    content: { overflowY: 'auto' },
    overlay: { zIndex: 1039 },
  };

  render() {
    return (
      <Sidebar
        sidebar={<AppNav />}
        open={this.props.open}
        styles={this.sidebarStyles}
        onSetOpen={this.props.openSidebar}
      >
        <TopNav />
        {this.props.children}
      </Sidebar>
    );
  }
}

export default ResponsiveSidebar;
