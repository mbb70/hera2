import React, { Component } from 'react';
import { Col } from 'reactstrap';

class Pair extends Component {
  render() {
    return (
      <Col className='col-md-auto'>
        {this.props.p1.name} {this.props.p2.name}
      </Col>
    );
  }
}

export default Pair;
