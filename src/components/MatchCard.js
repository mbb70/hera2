import React, { PureComponent } from 'react';
import {
  CardHeader,
  CardTitle,
  CardText,
  CardBlock,
  CardFooter,
  Card,
} from 'reactstrap';

class MatchCard extends PureComponent {
  render() {
    let matchStatus = <div>Ongoing</div>;
    if (this.props.match.winner !== undefined) {
      if (this.props.match.winner === -1) {
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

    const cardStyle = {
      opacity: this.props.match.winner !== undefined ? 0.7 : 1,
    };
    return (
      <Card
        className="width-initial-xs-down"
        style={cardStyle}
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
      </Card>
    );
  }
}

export default MatchCard;
