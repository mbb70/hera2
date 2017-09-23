import React, { PureComponent } from 'react';
class TabA extends PureComponent {
  render() {
    return (
      <a target="_blank" rel="noopener noreferrer" {...this.props}>
        {this.props.children}
      </a>
    );
  }
}

export default TabA;
