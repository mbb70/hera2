import { css, injectGlobal } from 'emotion';

const colors = {
  orange: '#DF691A',
  offWhite: '#EBEBEB',
  darkBlue: '#2B3E50',
  offDarkBlue: '#4E5D6C',
};

injectGlobal(`
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: ${colors.darkBlue};
  color: ${colors.offWhite};
}

@media (max-width: 576px) {
  .width-initial-xs-down {
    width: initial;
  }
}

@media (max-width: 400px) {
  .hidden-xxs-down {
    display: none !important;
  }
}
`);

export default {
  colors,
  css,
};
