import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import PairPlayerCell from './PairPlayerCell';
import Hutils from '../utils/hutils';

connect();

class PairingFormComponent extends PureComponent {
  resetForm = () => {
    this.props.resetPairsForm();
  }

  handleFormSubmit = () => {
    this.props.pairPlayers(this.props.pairs);
  }

  handleLoadForm = () => {
    this.props.rePairPlayers(this.props.activeUnlockedPlayers, this.props.settings, Hutils.shuffle);
  }

  handleSwap = (npId, opId) => {
    this.props.swapPairPlayers(npId, opId);
  }

  toggleEditing = () => {
    this.props.toggleEditing();
  }

  handleLockToggle = (checked, tableId) => {
    this.props.lockPairs(tableId, checked);
  }

  render() {
    const entryPoint = <Button color="link" onClick={this.handlePairPlayers}>Start New Round</Button>;
    const header = 'Select Pairings';
    const submitText='Start Match';
    const resetForm = this.resetForm;
    const onFormSubmit = this.handleFormSubmit;
    const onLoad = this.handleLoadForm;
    const invalid = this.props.editing;
    const leftButton = (
      <div className="d-flex mr-auto">
        <Button type="button" color="primary" style={{marginRight: '0.25rem'}} onClick={onLoad}>
          Re-pair
        </Button>
        <Button type="button" color="primary" onClick={this.toggleEditing}>
          {this.props.editing ? 'Done' : 'Edit'}
        </Button>
      </div>
    );

    const filteredPlayers = Object.values(this.props.activeUnlockedPlayers);

    const modalParams = {
      additionalModalParams: { size: 'lg' },
      invalid, entryPoint, header, submitText, leftButton, resetForm, onFormSubmit, onLoad,
    };
    return (
      <BasicFormModal {...modalParams}>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th className="hidden-xxs-down">Table</th>
              {this.props.editing && <th>Lock</th>}
              <th>Player 1</th>
              <th>Player 2</th>
            </tr>
          </thead>
          <tbody>
          {this.props.pairs.map(([pId, opId], i) => {
            const tableId = i.toString();
            const locked = !!this.props.lockedTables[tableId];
            return (
              <tr key={tableId} style={{color: locked ? '#DF691A' : ''}}>
                <td className="hidden-xxs-down">{1+i}</td>
                {this.props.editing && (
                  <td>
                    <input type="checkbox" checked={locked} onChange={(e) => this.handleLockToggle(e.target.checked, tableId)}/>
                  </td>
                )}
                {([pId, opId]).map((id) => {
                  const name = this.props.activePlayers[id].name;
                  return (
                    <td key={id}>
                      <PairPlayerCell editing={this.props.editing && !locked} pId={id} name={name} players={filteredPlayers} onChange={this.handleSwap}/>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </table>
      </BasicFormModal>
    );
  }
}

export default PairingFormComponent;
