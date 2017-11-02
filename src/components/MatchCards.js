import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CardGroup, Container, Row, Col } from 'reactstrap';
import MatchForm from './MatchForm';

connect();

class MatchCardsComponent extends PureComponent {
  render() {
    return (
      <Container fluid id="match-cards" className={this.props.className}>
        {this.props.filteredRounds.map(r => {
          const matches = r.matches.map(mId => this.props.filteredMatches[mId]);
          return (
            <Row className="round-row" key={r.id}>
              <Col>
                <h3 style={{ textAlign: 'center' }} className="m-3">
                  Round {r.number}
                </h3>
                <CardGroup style={{ justifyContent: 'center' }}>
                  {matches.map(m => (
                    <MatchForm
                      key={m.id}
                      match={m}
                      players={this.props.players}
                      updateMatch={this.props.updateMatch}
                    />
                  ))}
                </CardGroup>
              </Col>
            </Row>
          );
        })}
      </Container>
    );
  }
}

export default MatchCardsComponent;
