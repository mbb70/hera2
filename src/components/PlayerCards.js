import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PlayerHistoryForm from './PlayerHistoryForm';
import AddPlayerForm from './AddPlayerForm';
import Hutils from '../utils/hutils';
import { CardGroup, Container, Row, Col } from 'reactstrap';

connect();

class PlayerCardsComponent extends PureComponent {
  render() {
    if (this.props.settings === undefined) return null;
    let list = Object.values(this.props.players).map((player) => {
      return {...player,
        score: Hutils.getScore(player, this.props.settings),
      };
    }).filter((p) => {
      const searchEmpty = this.props.uiState.searchText === '';
      const searchMatches = p.name.toUpperCase().includes(this.props.uiState.searchText.toUpperCase());
      return (searchEmpty || searchMatches) && !p.bye && !p.deleted && !(p.dropped && this.props.uiState.hideDropped);
    });
    list = list.sort((p1, p2) => {
      const n1 = p1.name.toUpperCase();
      const n2 = p2.name.toUpperCase();
      if (n1 < n2) return -1;
      if (n1 > n2) return  1;
      return 0;
    });
    return (
      <Container fluid id="player-cards" className={this.props.className}>
        <Row>
          <Col>
            <CardGroup className="align-content-start flex-wrap" style={{justifyContent: 'center'}}>
              {list.map((p) =>
                  <PlayerHistoryForm
                    key={p.id}
                    player={p}
                    players={this.props.players}
                    matches={this.props.matches}
                    updatePlayer={this.props.updatePlayer}
                    updateMatch={this.props.updateMatch}
                  />
              )}
            </CardGroup>
            <CardGroup className="align-content-start flex-wrap" style={{justifyContent: 'center'}}>
              <AddPlayerForm onAddPlayers={this.props.onAddPlayers}/>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PlayerCardsComponent;
