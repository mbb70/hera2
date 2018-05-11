import React, { PureComponent } from 'react';
import Button from 'reactstrap/lib/Button';

class LinkButton extends PureComponent {
  render() {
    const style = { padding: 0, ...this.props.style };
    return (
      <Button {...this.props} style={style} color="link">
        {this.props.children}
      </Button>
    );
  }
}

export default LinkButton;
