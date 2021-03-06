import React, { PureComponent } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import styles from '../styles';

class ButtonRow extends PureComponent {
  isActive = i => {
    if (this.props.multi) {
      return this.props.selected.indexOf(i) !== -1;
    }
    return this.props.selected === i;
  };

  render() {
    return (
      <Row className={`no-gutters ${this.className}`}>
        {React.Children.map(this.props.children, (c, i) => (
          <Col>
            {React.cloneElement(c, {
              active: this.isActive(i),
              onClick: () => this.props.onClick(i),
            })}
          </Col>
        ))}
      </Row>
    );
  }

  className = styles.css({
    button: {
      width: '100%',
      border: 0,
      '&.active': {
        boxShadow: 'inset 0 0 10px #000 !important',
      },
    },
  });
}

export default ButtonRow;
