import React from 'react';
import '../../setupTests';
import FaqForm from '../FaqForm';
import { renderIntoDiv } from './ComponentTestUtils';

it('renders faqForm', () => {
  const component = <FaqForm onExit={() => {}} />;
  renderIntoDiv(component);
  const btns = document.getElementsByTagName('button');
  btns[0].click();
});
