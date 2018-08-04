import React from 'react';
import MatchCard from '../MatchCard';
import { renderIntoDiv } from './ComponentTestUtils';
import { getPlayedMatches } from '../../testUtils';

function renderMatchCard(players, match) {
  const updateFn = jest.fn();
  const component = (
    <MatchCard match={match} players={players} updateMatch={updateFn} />
  );
  renderIntoDiv(component);
  const matchStatus = document.getElementsByClassName('card-footer')[0]
    .textContent;
  return matchStatus;
}

it('renders draw', () => {
  const state = getPlayedMatches(5);
  const match = state.tournament.getIn(['matches', '1']).toJS();
  const players = state.tournament.get('players').toJS();
  const matchStatus = renderMatchCard(players, match);
  expect(matchStatus).toBe('Draw');
});

it('renders win', () => {
  const state = getPlayedMatches(5);
  const match = state.tournament.getIn(['matches', '1']).toJS();
  const players = state.tournament.get('players').toJS();
  match.winner = '2';
  match.score = '2 - 0';
  const matchStatus = renderMatchCard(players, match);
  expect(matchStatus).toBe('p1 (2 - 0)');
});

it('renders ongoing', () => {
  const state = getPlayedMatches(5);
  const match = state.tournament.getIn(['matches', '1']).toJS();
  const players = state.tournament.get('players').toJS();
  match.winner = undefined;
  const matchStatus = renderMatchCard(players, match);
  expect(matchStatus).toBe('Ongoing');
});
