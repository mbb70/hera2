import React, { PureComponent } from 'react';
import { Label, FormGroup, Input } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import PlayerCard from './PlayerCard';

class AddPlayerForm extends PureComponent {
  state = {
    names: [''],
  };

  resetForm = () => {
    this.setState({ names: [''] });
  };

  handleKeyPress = e => {
    const newnames = [...this.state.names];
    const index = +e.target.dataset.key;
    const value = e.target.value;
    if (index === newnames.length - 1 && newnames[index] === '') {
      newnames.push('');
    }
    if (value === '') {
      newnames.splice(index, 1);
    } else {
      newnames[index] = value;
    }
    this.setState({ names: newnames });
  };

  handleFormSubmit = () => {
    this.props.onAddPlayers(this.state.names.filter(n => n.trim() !== ''));
  };

  render() {
    const entryPoint = (
      <PlayerCard
        className="add-player-card"
        name="Add Players"
        addPlayerCard
      />
    );
    const header = 'Add Players';
    const submitText = 'Add All';
    const resetForm = this.resetForm;
    const onFormSubmit = this.handleFormSubmit;
    return (
      <BasicFormModal
        {...{ entryPoint, header, submitText, resetForm, onFormSubmit }}
      >
        <FormGroup>
          <Label>Names</Label>
          {this.state.names.map((name, i) => (
            <Input
              autoFocus={this.state.names.length === 1}
              key={i}
              data-key={i}
              type="text"
              value={name}
              onChange={this.handleKeyPress}
            />
          ))}
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default AddPlayerForm;
