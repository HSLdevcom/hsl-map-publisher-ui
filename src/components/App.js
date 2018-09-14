import React from 'react';
import { observer } from 'mobx-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from './theme';
import Frame from './Frame';

const App = observer(() => (
  <MuiThemeProvider muiTheme={theme}>
    <Frame />
  </MuiThemeProvider>
));

export default App;
