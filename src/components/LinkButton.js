import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';

class LinkButton extends PureComponent {
  render() {
    return (
      <Button {...this.props} color="link">
        {this.props.children}
      </Button>
    );
  }
}

export default LinkButton;
