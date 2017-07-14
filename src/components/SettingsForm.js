import React, { Component } from 'react';
import { Button, Label } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import ValidatedFormGroup from './ValidatedFormGroup';
import ValidationUtils from '../utils/validationUtils';

class SettingsForm extends Component {
  state = this.props;

  resetForm = () => {
    this.setState(this.props.settings);
  }

  handleKeyPress = (value, field) => {
    this.setState({ [field]: value });
  }

  handleFormSubmit = () => {
    this.props.saveSettings(this.state);
  }

  valid = () => {
    return ValidationUtils.isNumber(this.state.winPoints)  &
           ValidationUtils.isNumber(this.state.lossPoints) &
           ValidationUtils.isNumber(this.state.drawPoints);
  }

  render() {
    const entryPoint = <Button color="link">Settings</Button>;
    const header = 'Edit Settings';
    const submitText='Save';
    const resetForm = this.resetForm;
    const onFormSubmit = this.handleFormSubmit;
    const invalid = !this.valid();
    const fields = [
      { field: 'tournamentName', label: 'Tournament Title', valid: ValidationUtils.notEmpty},
      { field: 'winPoints',  label: 'Win Points',  valid: ValidationUtils.isNumber, type: 'number' },
      { field: 'lossPoints', label: 'Loss Points', valid: ValidationUtils.isNumber, type: 'number' },
      { field: 'drawPoints', label: 'Draw Points', valid: ValidationUtils.isNumber, type: 'number' },
    ]
    return (
      <BasicFormModal {...{invalid, entryPoint, header, submitText, resetForm, onFormSubmit}}>
        {fields.map(({ field, label, valid, type }, i) => {
          return (
            <ValidatedFormGroup
              key={i}
              field={field}
              value={this.state[field]}
              valid={valid}
              type={type}
              onChange={this.handleKeyPress}
            >
              <Label>{label}</Label>
            </ValidatedFormGroup>
          );
        })}
      </BasicFormModal>
    );
  }
}

export default SettingsForm;
