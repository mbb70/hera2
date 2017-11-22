import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

export function renderIntoDiv(component) {
  document.body.innerHTML = '';
  const div = document.createElement('div');
  ReactDOM.render(component, div);
  document.body.appendChild(div);
  return div;
}

export function changeEvent(component, target) {
  ReactTestUtils.Simulate.change(component, { target });
}

