import React, { PureComponent } from 'react';
import { cx } from 'emotion';
import Button from '../blocks/Button';
import styles from '../styles';

class LinkButton extends PureComponent {
  render() {
    return (
      <Button
        {...this.props}
        className={cx(this.props.className, this.className)}
        color="link"
      >
        {this.props.children}
      </Button>
    );
  }

  className = styles.css({
    color: styles.colors.orange,
    padding: 0,
    '&:hover': {
      color: styles.colors.orange,
      cursor: 'pointer',
      textDecoration: 'none',
    },
  });
}

export default LinkButton;
