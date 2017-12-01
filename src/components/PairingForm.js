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

  render() {
    const entryPoint = (
      <LinkButton onClick={this.handlePairPlayers}>Start New Round</LinkButton>
    );
    const header = 'Select Pairings';
    const submitText = 'Start Match';
    const resetForm = this.props.resetPairsForm;
    const onFormSubmit = this.handleFormSubmit;
    const onLoad = this.handleLoadForm;
    const onClose = this.props.onClose;
    const invalid = this.props.editing;
    const leftButton = (
      <div className="d-flex mr-auto">
        <Button
          type="button"
          color="primary"
          style={{ marginRight: '0.25rem' }}
          onClick={onLoad}
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

    const filteredPlayers = Object.values(this.props.activeUnlockedPlayers);

    const modalParams = {
      additionalModalParams: { size: 'lg' },
      invalid,
      entryPoint,
      header,
      submitText,
      leftButton,
      resetForm,
      onFormSubmit,
      onLoad,
      onClose,
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
                    const name = this.props.activePlayers[id].name;
                    return (
                      <td key={id}>
                        <PairPlayerCell
                          editing={this.props.editing && !locked}
                          pId={id}
                          name={name}
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
