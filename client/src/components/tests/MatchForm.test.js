import React from 'react';
import '../../setupTests';
import MatchForm from '../MatchForm';
import { renderIntoDiv } from './ComponentTestUtils';
import { getPlayedMatches } from '../../testUtils';

function renderMatchForm() {
  const updateFn = jest.fn();
  const state = getPlayedMatches(5);
  const match = state.getIn(['tournament', 'matches', '1']).toJS();
  const players = state.getIn(['tournament', 'players']).toJS();
  const component = (
    <MatchForm match={match} players={players} updateMatch={updateFn} />
  );
  renderIntoDiv(component);
  document.getElementsByTagName('a')[0].click();
  return updateFn;
}

function getButtons() {
  return Object.values(document.querySelectorAll('button.btn'));
}

function selectWinner(winner) {
  getButtons()
    .filter(a => a.innerHTML === winner)[0]
    .click();
}

function selectScore(score) {
  getButtons()
    .filter(a => a.innerHTML === score)[0]
    .click();
}

function selectDrop(drop) {
  getButtons()
    .filter(a => a.innerHTML === `Drop ${drop}`)[0]
    .click();
}

function submitForm() {
  getButtons()
    .filter(a => a.type === 'submit')[0]
    .click();
}

it('renders accepts all inputs', () => {
  const submitFn = renderMatchForm();
  selectWinner('Bye');
  selectScore('2 - 0');
  selectDrop('Bye');
  submitForm();
  const newMatch = submitFn.mock.calls[0][0];
  expect(newMatch.winner).toBe('1');
  expect(newMatch.score).toBe('2 - 0');
  expect(newMatch.drop).toEqual(['1']);
});

it('renders accepts all inputs', () => {
  const submitFn = renderMatchForm();
  selectWinner('p1');
  selectScore('1 - 0');
  selectDrop('p1');
  submitForm();
  const newMatch = submitFn.mock.calls[0][0];
  expect(newMatch.winner).toBe('2');
  expect(newMatch.score).toBe('1 - 0');
  expect(newMatch.drop).toEqual(['2']);
});

it('renders accepts all inputs', () => {
  const submitFn = renderMatchForm();
  selectWinner('p1');
  selectScore('2 - 1');
  selectDrop('p1');
  submitForm();
  const newMatch = submitFn.mock.calls[0][0];
  expect(newMatch.winner).toBe('2');
  expect(newMatch.score).toBe('2 - 1');
  expect(newMatch.drop).toEqual(['2']);
});

it('renders accepts all inputs', () => {
  const submitFn = renderMatchForm();
  selectWinner('Draw');
  selectDrop('p1');
  selectDrop('p1');
  submitForm();
  const newMatch = submitFn.mock.calls[0][0];
  expect(newMatch.winner).toBe('0');
  expect(newMatch.score).toBe('0 - 0');
});
