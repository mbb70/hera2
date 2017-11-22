import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import '../../setupTests';
import BasicFormModal from '../BasicFormModal';
import { renderIntoDiv, changeEvent } from './ComponentTestUtils';

it('renders basic form modal', () => {
  const entryPoint = <button>Test</button>;
  const header = 'Test Header';
  const resetForm = jest.fn();
  const onFormSubmit = jest.fn();
  const onExit = jest.fn();
  const component = <BasicFormModal {...{entryPoint, header, onFormSubmit, resetForm, onExit}} />;
  renderIntoDiv(component);
});
