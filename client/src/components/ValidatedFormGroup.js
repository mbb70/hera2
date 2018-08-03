import React, { PureComponent } from 'react';
import FormGroup from 'reactstrap/lib/FormGroup';
import ValidatedInput from './ValidatedInput';

class ValidatedFormGroup extends PureComponent {
  render() {
    return (
      <FormGroup>
        {this.props.children}
        <ValidatedInput {...this.props} />
      </FormGroup>
    );
  }
}

export default ValidatedFormGroup;
