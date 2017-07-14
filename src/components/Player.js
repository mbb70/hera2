import React, { Component } from 'react';
import { Card } from 'reactstrap';

class Player extends Component {
  render() {
    return (
      <Card outline={false} block={true}>
        Name: {this.props.name} Score: {this.props.score}
      </Card>
    );
  }
}

export default Player;
