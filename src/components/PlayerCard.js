import React, { PureComponent } from 'react';
import { cx } from 'emotion';
import CardImg from 'reactstrap/lib/CardImg';
import CardTitle from 'reactstrap/lib/CardTitle';
import CardText from 'reactstrap/lib/CardText';
import CardBlock from 'reactstrap/lib/CardBlock';
import GreyCard from './GreyCard';
import Hutils from '../utils/hutils';
import styles from '../styles';

class PlayerCard extends PureComponent {
  render() {
    const score = Hutils.getScorePojo(this.props, this.props.settings);
    return (
      <GreyCard
        grey={this.props.dropped}
        tag="a"
        className={cx('width-initial-xs-down', this.props.className)}
        onClick={this.props.onClick}
      >
        <CardImg top width="100%" src="player_image.png" alt="card image cap" />
        <CardBlock>
          <CardTitle>
            {this.props.addPlayerCard && (
              <div className={cx(this.addPlayerClassName, 'd-inline-block')} />
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

  addPlayerClassName = styles.css({
    marginRight: 10,
    float: 'left',
    width: 25,
    height: 25,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf6,<svg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'><path stroke='grey' fill='grey' d='M10 0 h10 v10 h10 v10 h-10 v10 h-10 v-10 h-10 v-10 h10 z'/></svg>\")",
  });
}

export default PlayerCard;
