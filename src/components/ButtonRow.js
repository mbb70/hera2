import React, { PureComponent } from 'react';
import { Row, Col } from 'reactstrap';

class ButtonRow extends PureComponent {
  isActive = i => {
    if (this.props.multi) {
      return this.props.selected.indexOf(i) !== -1;
    } else {
      return this.props.selected === i;
    }
  };

  render() {
    return (
      <Row className="no-gutters button-row">
        {React.Children.map(this.props.children, (c, i) => {
          return (
            <Col>
              {React.cloneElement(c, {
                active: this.isActive(i),
                onClick: () => this.props.onClick(i),
              })}
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default ButtonRow;
