import React from 'react';
import '../../setupTests';
import AddPlayerForm from '../AddPlayerForm';
import { renderIntoDiv, changeEvent } from './ComponentTestUtils';

function simulatePlayerAdd(form, value, key) {
  changeEvent(form, { value, dataset: { key } });
}

it('renders add player form', () => {
  const component = <AddPlayerForm addPlayers={() => {}} />;
  renderIntoDiv(component);
});

it('adds and removes players from form', () => {
  const testFn = jest.fn();
  const component = <AddPlayerForm addPlayers={testFn} />;
  renderIntoDiv(component);
  const btns = document.getElementsByClassName('add-player-card');
  btns[0].click();
  const form = document.getElementsByClassName('form-control')[0];

  // Adds Users
  simulatePlayerAdd(form, 'Matt', 0);
  simulatePlayerAdd(form, 'Bruce', 1);
  simulatePlayerAdd(form, 'Chloe', 2);

  // Removes Users
  simulatePlayerAdd(form, '', 1);
  const submitButton = document.getElementsByClassName('btn-primary')[0];
  submitButton.click();
  const returnValue = testFn.mock.calls[0][0];
  expect(returnValue).toEqual(['Matt', 'Chloe']);
});
