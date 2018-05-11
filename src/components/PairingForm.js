import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'reactstrap/lib/Button';
import BasicFormModal from './BasicFormModal';
import PairPlayerCell from './PairPlayerCell';
import LinkButton from './LinkButton';
import Hutils from '../utils/hutils';

connect();

class PairingFormComponent extends PureComponent {
  handleFormSubmit = () => {
    this.props.pairPlayers(this.props.pairs);
  };

  handleLoadForm = () => {
    this.props.rePairPlayers(Hutils.shuffle);
  };

  getLeftButton = () => (
    <div className="d-flex mr-auto">
      <Button
        type="button"
        color="primary"
        style={{ marginRight: '0.25rem' }}
        onClick={this.handleLoadForm}
      >
        Re-pair
      </Button>
      <Button
        type="button"
        color="primary"
        onClick={this.props.togglePairEditing}
      >
        {this.props.editing ? 'Done' : 'Edit'}
      </Button>
    </div>
  );

  render() {
    const filteredPlayers = Object.values(this.props.activeUnlockedPlayers);
    const modalParams = {
      additionalModalParams: { size: 'lg' },
      header: 'Select Pairings',
      submitText: 'Start Match',
      invalid: this.props.editing,
      leftButton: this.getLeftButton(),
      resetForm: this.props.resetPairsForm,
      onFormSubmit: this.handleFormSubmit,
      onLoad: this.handleLoadForm,
      onClose: this.props.onClose,
      entryPoint: <LinkButton>Start New Round</LinkButton>,
    };

    return (
      <BasicFormModal {...modalParams}>
        <table style={{ width: '100%' }}>
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
                <tr key={tableId} style={{ color: locked ? '#DF691A' : '' }}>
                  <td className="hidden-xxs-down">{1 + i}</td>
                  {this.props.editing && (
                    <td>
                      <input
                        type="checkbox"
                        checked={locked}
                        onChange={e =>
                          this.props.lockPairs(tableId, e.target.checked)}
                      />
                    </td>
                  )}
                  {[pId, opId].map(id => {
                    const player = this.props.activePlayers[id];
                    return (
                      <td key={id}>
                        <PairPlayerCell
                          editing={this.props.editing && !locked}
                          player={player}
                          players={filteredPlayers}
                          onChange={this.props.swapPairPlayers}
                        />
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
