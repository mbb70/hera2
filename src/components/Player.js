import React, { PureComponent } from 'react';
import { Card } from 'reactstrap';

class Player extends PureComponent {
  render() {
    return (
      <Card outline={false} block={true}>
        Name: {this.props.name} Score: {this.props.score}
      </Card>
    );
  }
}

export default Player;
