import React from 'react';
import Button from '../../blocks/Button';
import '../../setupTests';
import ButtonCol from '../ButtonCol';
import { renderIntoDiv } from './ComponentTestUtils';

it('renders button columns', () => {
  const onClick = jest.fn();
  const component = (
    <ButtonCol selected={0} onClick={onClick}>
      <Button id="t1">Test 1</Button>
      <Button id="t2">Test 2</Button>
    </ButtonCol>
  );
  renderIntoDiv(component);
  const active = document.getElementById('t1').className.split(' ');
  expect(active.indexOf('active')).toBeGreaterThan(-1);

  const inactive = document.getElementById('t2').className.split(' ');
  expect(inactive.indexOf('active')).toBe(-1);

  document.getElementById('t2').click();
  expect(onClick.mock.calls[0][0]).toBe(1);
});
it('renders multi button columns', () => {
  const component = (
    <ButtonCol multi selected={[0, 1]}>
      <Button id="t1">Test 1</Button>
      <Button id="t2">Test 2</Button>
    </ButtonCol>
  );
  renderIntoDiv(component);
  const activeBtns = document.getElementsByClassName('active');
  expect(activeBtns.length).toBe(2);
});
