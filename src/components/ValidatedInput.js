import React, { PureComponent } from 'react';
import { Input } from 'reactstrap';

class ValidatedInput extends PureComponent {
  handleKeyPress = e => {
    this.props.onChange(this.props.field, e.target.value);
  };

  render() {
    const valid = !this.props.valid || this.props.valid(this.props.value);
    const className = valid ? '' : 'is-invalid';
    return (
      <Input
        className={className}
        type={this.props.type || 'text'}
        value={this.props.value}
        onChange={this.handleKeyPress}
      />
    );
  }
}

export default ValidatedInput;
