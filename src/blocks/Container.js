import React from 'react';
import Container from 'reactstrap/lib/Container';
import { cx } from 'emotion';
import styles from '../styles';

const className = styles.css({
  paddingTop: '15px',
});

export default props => (
  <Container {...props} className={cx(className, props.className)}>
    {props.children}
  </Container>
);
