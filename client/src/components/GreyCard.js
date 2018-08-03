import React, { PureComponent } from 'react';
import Card from 'reactstrap/lib/Card';
import { cx } from 'emotion';
import styles from '../styles';

class GreyCard extends PureComponent {
  render() {
    const { grey, ...props } = this.props;
    const style = { opacity: grey ? 0.7 : 1 };
    return (
      <Card
        {...props}
        style={style}
        className={cx(props.className, this.className)}
      >
        {this.props.children}
      </Card>
    );
  }

  className = styles.css({
    borderRadius: 0,
    boxShadow: '2px 2px 1px #888',
    margin: '5px',
    width: '280px',
    border: `${styles.colors.offWhite} solid thin`,
    backgroundColor: styles.colors.offDarkBlue,
    color: `${styles.colors.orange} !important`,
    '.card-title': {
      marginBottom: '0.2rem',
    },
    '.card-playing': {
      color: styles.colors.offWhite,
    },
    '.card-block': {
      padding: '0.75rem 1.25rem',
    },
    '.card-footer': {
      padding: '0.5rem 1.25rem',
      backgroundColor: 'silver',
    },
    '.card-header': {
      padding: '0.5rem 1.25rem',
      backgroundColor: 'silver',
    },
    '.card-footer:last-child': {
      borderRadius: 0,
    },
    '.card-header:first-child': {
      borderRadius: 0,
    },
    '.card-group .card:only-child': {
      borderRadius: 0,
      marginBottom: 5,
    },
    '.card-img-top': {
      borderTopLeftRadius: '0 !important',
      borderTopRightRadius: '0 !important',
    },
  });
}

export default GreyCard;
