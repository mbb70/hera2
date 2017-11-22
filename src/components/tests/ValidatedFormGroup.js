import React, { PureComponent } from 'react';
import { FormGroup, Input } from 'reactstrap';

class ValidatedFormGroup extends PureComponent {
  handleKeyPress = e => this.props.onChange(this.props.field, e.target.value);

  render() {
    const valid = !this.props.valid || this.props.valid(this.props.value);
    const className = valid ? '' : 'is-invalid';
    return (
      <FormGroup>
        {this.props.children}
        <Input
          className={className}
          type={this.props.type || 'text'}
          value={this.props.value}
          onChange={this.handleKeyPress}
        />
      </FormGroup>
    );
  }
}

export default ValidatedFormGroup;
