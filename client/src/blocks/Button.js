import React from 'react';
import { cx } from 'emotion';
import Button from 'reactstrap/lib/Button';
import styles from '../styles';

const className = styles.css({
  borderRadius: 0,
  '.btn-neutral': {
    backgroundColor: 'rgb(192, 192, 192)',
  },
});

export default props => (
  <Button {...props} className={cx(className, props.className)}>
    {props.children}
  </Button>
);
