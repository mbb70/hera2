import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CardGroup, Container, Row, Col } from 'reactstrap';
import MatchForm from './MatchForm';

connect();

class MatchCardsComponent extends PureComponent {
  searchFilter = (m) => {
    const searchEmpty = this.props.uiState.searchText === '';
    const p1Match = this.props.players[m.p1].name.toUpperCase().includes(this.props.uiState.searchText.toUpperCase());
    const p2Match = this.props.players[m.p2].name.toUpperCase().includes(this.props.uiState.searchText.toUpperCase());
    const searchMatches = p1Match || p2Match;
    return (searchEmpty || searchMatches);
  }

  render() {
    const nRounds = this.props.rounds.length;
    return (
      <Container fluid id="match-cards" className={this.props.className}>
        {this.props.rounds.map((r, i) => {
          const matches = r.matches
            .map(mId => this.props.matches[mId])
            .filter(this.searchFilter)
            .sort((a,b) => +a.id - +b.id);
          if (matches.length === 0) return undefined
          return (
            <Row className="round-row" key={r.id}>
              <Col>
                <h3 style={{textAlign: 'center'}} className="m-3">Round {nRounds - i}</h3>
                <CardGroup style={{justifyContent: 'center'}}>
                  {matches.map((m) =>
                    <MatchForm
                      key={m.id}
                      match={m}
                      players={this.props.players}
                      updateMatch={this.props.updateMatch}
                    />
                  )}
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
