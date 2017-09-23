import React, { PureComponent } from 'react';
import { Row, Col } from 'reactstrap';

class ButtonCol extends PureComponent {
  isActive = (i) => {
    if (this.props.multi) {
      return this.props.selected.indexOf(i) !== -1;
    } else {
      return this.props.selected === i;
    }
  }

  render() {
    return (
      <Col className="my-1 no-gutters button-col">
        {React.Children.map(this.props.children, (c, i) => {
          return (
            <Row>{React.cloneElement(c, {
              active: this.isActive(i),
              onClick: () => this.props.onClick(i),
            })
            }</Row>
          );
        })}
      </Col>
    );
  }
}

export default ButtonCol;
