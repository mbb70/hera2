import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class ButtonRow extends Component {
  state = {
    selected: -1,
  }

  render() {
    return (
      <Row className="my-1 no-gutters button-row">
        {React.Children.map(this.props.children, (c, i) => {
          return (
            <Col>{React.cloneElement(c, {
              active: this.props.selected === i,
              onClick: () => this.props.onClick(i)
            })
            }</Col>
          );
        })}
      </Row>
    );
  }
}

export default ButtonRow;
