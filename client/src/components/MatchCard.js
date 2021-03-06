import React, { PureComponent } from 'react';
import CardHeader from 'reactstrap/lib/CardHeader';
import CardTitle from 'reactstrap/lib/CardTitle';
import CardText from 'reactstrap/lib/CardText';
import CardBlock from 'reactstrap/lib/CardBlock';
import CardFooter from 'reactstrap/lib/CardFooter';
import GreyCard from './GreyCard';

class MatchCard extends PureComponent {
  render() {
    let matchStatus = <div>Ongoing</div>;
    if (this.props.match.winner !== undefined) {
      if (this.props.match.winner === '0') {
        matchStatus = <div>Draw</div>;
      } else {
        matchStatus = (
          <div>
            {this.props.players[this.props.match.winner].name}{' '}
            <span style={{ whiteSpace: 'nowrap' }}>
              ({this.props.match.score})
            </span>
          </div>
        );
      }
    }

    const hasWinner = this.props.match.winner !== undefined;
    return (
      <GreyCard
        grey={hasWinner}
        className="width-initial-xs-down"
        tag="a"
        onClick={this.props.onClick}
      >
        <CardHeader>
          <CardTitle>Table {this.props.match.table}</CardTitle>
        </CardHeader>
        <CardBlock>
          <CardText style={{ textAlign: 'center' }}>
            <span className="card-playing d-block">
              {this.props.players[this.props.match.p1].name}
            </span>
            <span className="card-playing d-block">vs.</span>
            <span className="card-playing d-block">
              {this.props.players[this.props.match.p2].name}
            </span>
          </CardText>
        </CardBlock>
        <CardFooter>{matchStatus}</CardFooter>
      </GreyCard>
    );
  }
}

export default MatchCard;
