import React from 'react';
import { Button } from 'reactstrap';
import '../../setupTests';
import ButtonRow from '../ButtonRow';
import { renderIntoDiv } from './ComponentTestUtils';

it('renders button rows', () => {
  const onClick = jest.fn();
  const component = (
    <ButtonRow selected={0} onClick={onClick}>
      <Button id="t1">Test 1</Button>
      <Button id="t2">Test 2</Button>
    </ButtonRow>
  );
  renderIntoDiv(component);
  const active = document.getElementById('t1').className.split(' ');
  expect(active.indexOf('active')).toBeGreaterThan(-1);

  const inactive = document.getElementById('t2').className.split(' ');
  expect(inactive.indexOf('active')).toBe(-1);

  document.getElementById('t2').click();
  expect(onClick.mock.calls[0][0]).toBe(1);
});
it('renders multi button rows', () => {
  const component = (
    <ButtonRow multi selected={[0, 1]}>
      <Button id="t1">Test 1</Button>
      <Button id="t2">Test 2</Button>
    </ButtonRow>
  );
  renderIntoDiv(component);
  const activeBtns = document.getElementsByClassName('active');
  expect(activeBtns.length).toBe(2);
});
