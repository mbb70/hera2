import React from 'react';
import Label from 'reactstrap/lib/Label';
import { cx } from 'emotion';
import styles from '../styles';

const className = styles.css({
  borderRadius: 0,
});

export default props => (
  <Label {...props} className={cx(className, props.className)}>
    {props.children}
  </Label>
);
