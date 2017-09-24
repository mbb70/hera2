import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import PairPlayerCell from './PairPlayerCell';
import Hutils from '../utils/hutils';

class PairingForm extends PureComponent {
  initialState = () => ({
    editing: false,
    pairs: [],
    lockedTables: {},
  });

  state = this.initialState();

  resetForm = () => {
    this.setState(this.initialState());
  }

  handleFormSubmit = () => {
    this.props.pairPlayers(this.state.pairs);
  }

  handleLoadForm = () => {
    const lockedPairs = this.state.pairs.filter((pair, tableId) => this.state.lockedTables[tableId]);
    const lockedTables = Object.keys(this.state.lockedTables).filter(k => this.state.lockedTables[k]);
    const lockedPlayerMap = this.getLockedPlayerMap();
    const activePlayerIds = Object.values(this.props.players)
      .filter(p => !p.deleted && !p.dropped && !lockedPlayerMap[p.id])
      .map(p => p.id);
    const shuffledIds = Hutils.shuffle(activePlayerIds);
    const pairs = Hutils.shuffle(Hutils.pairPlayers(shuffledIds, this.props.players, this.props.settings));
    lockedTables.forEach((t, i) => pairs.splice(t, 0, lockedPairs[i]));
    this.setState({ pairs });
  }

  handleSwap = (npId, opId) => {
    const pairs = this.state.pairs.map(([p1, p2]) => {
      if (npId === p1 && opId === p2) return [opId, npId];
      if (npId === p2 && opId === p1) return [npId, opId];
      if (npId === p1) return [opId, p2];
      if (npId === p2) return [p1, opId];
      if (opId === p1) return [npId, p2];
      if (opId === p2) return [p1, npId];
      return [p1, p2];
    });
    this.setState({ pairs });
  }

  toggleEditing = () => {
    this.setState({ editing: !this.state.editing });
  }

  handleLockToggle = (checked, tableId) => {
    const lockedTables = {...this.state.lockedTables, [tableId]: checked };
    this.setState({ lockedTables });
  }

  getLockedPlayerMap = () => {
    return Object.keys(this.state.lockedTables)
      .filter(tableId => this.state.lockedTables[tableId])
      .map(tableId => this.state.pairs[tableId])
      .reduce((h, [p1, p2]) => {
        h[p1] = true;
        h[p2] = true;
        return h;
      }, {});
  }

  render() {
    const entryPoint = <Button color="link" onClick={this.handlePairPlayers}>Start New Round</Button>;
    const header = 'Select Pairings';
    const submitText='Start Match';
    const resetForm = this.resetForm;
    const onFormSubmit = this.handleFormSubmit;
    const onLoad = this.handleLoadForm;
    const invalid = this.state.editing;
    const leftButton = (
      <div className="d-flex mr-auto">
        <Button type="button" color="primary" style={{marginRight: '0.25rem'}} onClick={onLoad}>
          Re-pair
        </Button>
        <Button type="button" color="primary" onClick={this.toggleEditing}>
          {this.state.editing ? 'Done' : 'Edit'}
        </Button>
      </div>
    );
    const lockedPlayerMap = this.getLockedPlayerMap();
    const byePlayerId = this.props.settings.byePlayerId;
    const filteredPlayers = Object.values(this.props.players).filter(p => {
      const available = !p.deleted && !p.dropped;
      const notLocked = !lockedPlayerMap[p.id];
      return available && notLocked;
    });
    const needsBye = filteredPlayers.length % 2 === 0;
    const players = filteredPlayers
      .filter(p => needsBye || p.id !== byePlayerId)
      .sort((a, b) => a.name > b.name);

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
              {this.state.editing && <th>Lock</th>}
              <th>Player 1</th>
              <th>Player 2</th>
            </tr>
          </thead>
          <tbody>
          {this.state.pairs.map(([pId, opId], tableId) => {
            const locked = !!this.state.lockedTables[tableId];
            return (
              <tr key={tableId} style={{color: locked ? '#DF691A' : ''}}>
                <td className="hidden-xxs-down">{tableId+1}</td>
                {this.state.editing && (
                  <td>
                    <input type="checkbox" checked={locked} onChange={(e) => this.handleLockToggle(e.target.checked, tableId)}/>
                  </td>
                )}
                {([pId, opId]).map((id) => {
                  const name = this.props.players[id].name;
                  return (
                    <td key={id}>
                      <PairPlayerCell editing={this.state.editing && !locked} pId={id} name={name} players={players} onChange={this.handleSwap}/>
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

export default PairingForm;
