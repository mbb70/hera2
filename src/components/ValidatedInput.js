import React, { PureComponent } from 'react';
import Input from 'reactstrap/lib/Input';
import { cx } from 'emotion';
import styles from '../styles';

class ValidatedInput extends PureComponent {
  handleKeyPress = e =>
    this.props.onChange(this.props.field, e.target.value, e);

  render() {
    const { valid, children, className, type, onChange, ...props } = this.props;
    const isValid = !valid || valid(this.props.value);
    const validClassName = isValid ? undefined : 'is-invalid';
    return (
      <Input
        {...props}
        className={cx(className, this.className, validClassName)}
        type={props.type || 'text'}
        onChange={this.handleKeyPress}
      />
    );
  }

  className = styles.css({
    borderRadius: 0,
  });
}

export default ValidatedInput;
