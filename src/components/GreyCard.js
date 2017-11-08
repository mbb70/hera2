import React, { PureComponent } from 'react';
import { Card } from 'reactstrap';

class GreyCard extends PureComponent {
  render() {
    const { grey, ...props } = this.props;
    console.log(grey, props);
    const style = { opacity: grey ? 0.7 : 1 };
    return (
      <Card {...props} style={style}>
        {this.props.children}
      </Card>
    );
  }
}

export default GreyCard;
