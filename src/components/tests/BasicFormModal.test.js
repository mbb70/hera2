import React from 'react';
import '../../setupTests';
import BasicFormModal from '../BasicFormModal';
import { renderIntoDiv } from './ComponentTestUtils';

it('renders basic form modal', () => {
  const entryPoint = <button id="entry-btn">Test</button>;
  const header = 'Test Header';
  const resetForm = jest.fn();
  const onFormSubmit = jest.fn();
  const onExit = jest.fn();
  const onLoad = jest.fn();
  const submitButton = (
    <button id="submit-btn" onClick={onFormSubmit}>
      Submit
    </button>
  );
  const component = (
    <BasicFormModal
      {...{
        entryPoint,
        header,
        submitButton,
        onLoad,
        onFormSubmit,
        resetForm,
        onExit,
      }}
    />
  );
  renderIntoDiv(component);
  document.getElementById('entry-btn').click();
  expect(onLoad.mock.calls.length).toBe(1);
  expect(resetForm.mock.calls.length).toBe(1);

  document.getElementById('submit-btn').click();
  expect(onFormSubmit.mock.calls.length).toBe(1);
  expect(resetForm.mock.calls.length).toBe(2);
});
