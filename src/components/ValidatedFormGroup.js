import React, { PureComponent } from 'react';
import { FormGroup, Input } from 'reactstrap';

class ValidatedFormGroup extends PureComponent {
  handleKeyPress = (e) => {
    this.props.onChange(this.props.field, e.target.value)
  }

  render() {
    const valid = !this.props.valid || this.props.valid(this.props.value);
    const name = valid ? '' : 'danger';
    return (
      <FormGroup color={name}>
        { this.props.children }
        <Input className={"form-control form-control-`name`"}
               type={this.props.type || 'text'}
               value={this.props.value}
               onChange={this.handleKeyPress}
        />
      </FormGroup>
    );
  }
}

export default ValidatedFormGroup;
