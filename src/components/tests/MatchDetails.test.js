import React from 'react';
import '../../setupTests';
import MatchDetails from '../MatchDetails';
import { renderIntoDiv } from './ComponentTestUtils';
import { getPlayedMatches } from '../../testUtils';

function renderMatchDetails(players, match, player, op) {
  const component = (
    <MatchDetails players={players} player={player} match={match} op={op} />
  );
  const div = renderIntoDiv(component);
  return div.textContent;
}

it('renders match details draw', () => {
  const state = getPlayedMatches(5);
  const match = state.getIn(['tournament', 'matches', '1']).toJS();
  const players = state.getIn(['tournament', 'players']).toJS();
  const player = players[1];
  const op = players[2];
  const o = renderMatchDetails(players, match, player, op);
  expect(o).toBe('Draw - p1 (0 - 0)');
});

it('renders match details won', () => {
  const state = getPlayedMatches(5);
  const match = state.getIn(['tournament', 'matches', '2']).toJS();
  const players = state.getIn(['tournament', 'players']).toJS();
  const player = players[3];
  const op = players[4];
  const o = renderMatchDetails(players, match, player, op);
  expect(o).toBe('Won - p3 (2 - 0)');
});

it('renders match details lost', () => {
  const state = getPlayedMatches(5);
  const match = state.getIn(['tournament', 'matches', '2']).toJS();
  const players = state.getIn(['tournament', 'players']).toJS();
  const player = players[4];
  const op = players[3];
  const o = renderMatchDetails(players, match, player, op);
  expect(o).toBe('Lost - p2 (0 - 2)');
});

it('renders match details ongoing', () => {
  const state = getPlayedMatches(5);
  const match = state.getIn(['tournament', 'matches', '2']).toJS();
  const players = state.getIn(['tournament', 'players']).toJS();
  match.winner = undefined;
  const player = players[3];
  const op = players[4];
  const o = renderMatchDetails(players, match, player, op);
  expect(o).toBe('Ongoing - p3 (2 - 0)');
});
