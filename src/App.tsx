import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Router from './Router';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
