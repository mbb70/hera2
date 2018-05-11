import React from 'react';
import '../../setupTests';
import PairPlayerCell from '../PairPlayerCell';
import { renderIntoDiv, changeEvent } from './ComponentTestUtils';

it('renders pair player cell', () => {
  const players = [{ id: '0', name: 'p0' }, { id: '1', name: 'p1' }];
  const changeFn = jest.fn();
  const component = (
    <PairPlayerCell
      editing
      player={players[0]}
      players={players}
      onChange={changeFn}
    />
  );
  renderIntoDiv(component);
  const select = document.querySelector('select');
  changeEvent(select, { value: '0' });
  expect(changeFn.mock.calls[0][0]).toBe('0');
});
