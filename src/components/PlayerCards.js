import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CardGroup from 'reactstrap/lib/CardGroup';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import PlayerHistoryForm from './PlayerHistoryForm';
import AddPlayerForm from './AddPlayerForm';

connect();

class PlayerCardsComponent extends PureComponent {
  render() {
    return (
      <Container fluid id="player-cards" className={this.props.className}>
        <Row>
          <Col>
            <CardGroup style={{ justifyContent: 'center' }}>
              {this.props.filteredPlayers.map(p => (
                <PlayerHistoryForm
                  key={p.id}
                  player={p}
                  settings={this.props.settings}
                  players={this.props.players}
                  matches={this.props.matches}
                  updatePlayer={this.props.updatePlayer}
                  updateMatch={this.props.updateMatch}
                />
              ))}
            </CardGroup>
            <CardGroup
              className="align-content-start flex-wrap"
              style={{ justifyContent: 'center' }}
            >
              <AddPlayerForm addPlayers={this.props.addPlayers} />
            </CardGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PlayerCardsComponent;
