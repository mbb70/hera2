import React, { PureComponent } from 'react';

class PairPlayerCell extends PureComponent {
  render() {
    if (this.props.editing) {
      return (
        <select value={this.props.pId} onChange={(e) => this.props.onChange(e.target.value, this.props.pId)}>
          {this.props.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      );
    } else {
      return <span>{this.props.name}</span>;
    }
  }
}

export default PairPlayerCell;
