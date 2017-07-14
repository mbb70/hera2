import React, { Component } from 'react';
import _ from 'lodash';
import PlayerHistoryForm from './PlayerHistoryForm';
import AddPlayerForm from './AddPlayerForm';
import Hutils from '../utils/hutils';
import { CardGroup, Container, Row, Col } from 'reactstrap';

class PlayerCards extends Component {
  state = {
    searchBar: '',
    sortBy: 'name',
  };

  render() {
    let list = _.values(this.props.players).map((player) => {
      const p = {...player};
      p.score = Hutils.getScore(p, this.props.settings)
      return p;
    }).filter((p) => {
      const searchEmpty = this.props.searchText === '';
      const searchMatches = p.name.toUpperCase().includes(this.props.searchText.toUpperCase());
      return (searchEmpty || searchMatches) && !p.bye && !p.deleted;
    });
    list = _.sortBy(list, this.state.sortBy);
    return (
      <Container fluid>
        <Row>
          <Col>
            <CardGroup style={{justifyContent: 'center'}}>
              {list.map((p) =>
                  <PlayerHistoryForm
                    key={p.id}
                    player={{...p}}
                    players={this.props.players}
                    matches={this.props.matches}
                    updatePlayer={this.props.updatePlayer}
                    updateMatch={this.props.updateMatch}
                  />
              )}
              <AddPlayerForm onAddPlayers={this.props.onAddPlayers}/>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PlayerCards;
