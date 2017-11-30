import React, { PureComponent } from 'react';
import Button from 'reactstrap/lib/Button';

class LinkButton extends PureComponent {
  render() {
    return (
      <Button {...this.props} style={{ padding: 0 }} color="link">
        {this.props.children}
      </Button>
    );
  }
}

export default LinkButton;
