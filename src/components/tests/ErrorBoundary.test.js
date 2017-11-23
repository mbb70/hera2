import React from 'react';
import '../../setupTests';
import ErrorBoundary from '../ErrorBoundary';
import { renderIntoDiv } from './ComponentTestUtils';

it('renders nothing on no error', () => {
  const NoErrorComponent = () => '';

  const component = (
    <ErrorBoundary>
      <NoErrorComponent />
    </ErrorBoundary>
  );
  const div = renderIntoDiv(component);
  expect(div.innerHTML).toBe('');
});
it('renders error boundary on error', () => {
  const ErrorComponent = () => {
    throw 'error';
  };

  const component = (
    <ErrorBoundary>
      <ErrorComponent />
    </ErrorBoundary>
  );
  const div = renderIntoDiv(component);
  expect(div.innerHTML).not.toBe('');
});
