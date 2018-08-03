import React, { PureComponent } from 'react';

class PairPlayerCell extends PureComponent {
  render() {
    if (this.props.editing) {
      return (
        <select
          value={this.props.player.id}
          onChange={e =>
            this.props.onChange(e.target.value, this.props.player.id)}
        >
          {this.props.players.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      );
    }
    return <span>{`${this.props.player.name}`}</span>;
  }
}

export default PairPlayerCell;
