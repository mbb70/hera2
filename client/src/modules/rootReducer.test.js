import { fromJS } from 'immutable';
import { migrations } from '../store';
import { saveState, getInitialState, newInitialState } from './rootReducer';

it('migrates v2', () => {
  const state = newInitialState();
  state.version = 2;
  state.tournament = state.tournament.set('matches',
    fromJS({
      1: {
        winner: -1,
      },
      2: {
        winner: '2',
      },
    })
  )
  const savedState = migrations[state.version](state);
  const matchDraw = savedState.tournament.getIn(['matches', '1', 'winner']);
  expect(matchDraw).toBe('0');
  const matchWinner = savedState
    .tournament
    .getIn([
      'matches',
      '2',
      'winner',
  ]);
  expect(matchWinner).toBe('2');
});

