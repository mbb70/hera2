import React, { PureComponent } from 'react';
import { CardImg, CardTitle, CardText, CardBlock } from 'reactstrap';
import GreyCard from './GreyCard';
import Hutils from '../utils/hutils';

class PlayerCard extends PureComponent {
  render() {
    const score = Hutils.getScorePojo(this.props, this.props.settings);
    return (
      <GreyCard
        grey={this.props.dropped}
        tag="a"
        className={`width-initial-xs-down ${this.props.className || ''}`}
        onClick={this.props.onClick}
      >
        <CardImg top width="100%" src="player_image.png" alt="card image cap" />
        <CardBlock>
          <CardTitle>
            {this.props.addPlayerCard && (
              <div className="add-player-icon d-inline-block" />
            )}
            {this.props.name}
          </CardTitle>
          <CardText>
            {this.props.playing !== undefined && (
              <span className="card-playing d-block">
                Playing: {this.props.players[this.props.playing].name}
              </span>
            )}
            {score !== undefined && (
              <span className="card-playing d-block">Score: {score}</span>
            )}
          </CardText>
        </CardBlock>
      </GreyCard>
    );
  }
}

export default PlayerCard;
