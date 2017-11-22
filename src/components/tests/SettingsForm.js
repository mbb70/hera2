import React, { PureComponent } from 'react';
import { Label } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import ValidatedFormGroup from './ValidatedFormGroup';
import LinkButton from './LinkButton';
import ValidationUtils from '../utils/validationUtils';

class SettingsForm extends PureComponent {
  state = this.props;

  resetForm = () => {
    this.setState(this.props.settings);
  };

  handleKeyPress = (field, value) => {
    this.setState({ [field]: value });
  };

  handleFormSubmit = () => {
    this.props.saveSettings(this.state);
  };

  valid = () =>
    ValidationUtils.isNumber(this.state.winPoints) &
    ValidationUtils.isNumber(this.state.lossPoints) &
    ValidationUtils.isNumber(this.state.drawPoints);

  render() {
    const entryPoint = <LinkButton>Settings</LinkButton>;
    const header = 'Edit Settings';
    const submitText = 'Save';
    const resetForm = this.resetForm;
    const onFormSubmit = this.handleFormSubmit;
    const onExit = this.props.onExit;
    const invalid = !this.valid();
    const fields = [
      {
        field: 'tournamentName',
        label: 'Tournament Title',
        valid: ValidationUtils.notEmpty,
      },
      {
        field: 'winPoints',
        label: 'Win Points',
        valid: ValidationUtils.isNumber,
        type: 'number',
      },
      {
        field: 'lossPoints',
        label: 'Loss Points',
        valid: ValidationUtils.isNumber,
        type: 'number',
      },
      {
        field: 'drawPoints',
        label: 'Draw Points',
        valid: ValidationUtils.isNumber,
        type: 'number',
      },
    ];
    return (
      <BasicFormModal
        {...{
          invalid,
          entryPoint,
          header,
          submitText,
          resetForm,
          onFormSubmit,
          onExit,
        }}
      >
        {fields.map(({ field, label, valid, type }) => (
          <ValidatedFormGroup
            key={field}
            field={field}
            value={this.state[field]}
            valid={valid}
            type={type}
            onChange={this.handleKeyPress}
          >
            <Label>{label}</Label>
          </ValidatedFormGroup>
        ))}
      </BasicFormModal>
    );
  }
}

export default SettingsForm;
