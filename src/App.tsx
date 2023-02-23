import { useAuthUser } from '@react-query-firebase/auth';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { auth } from './firebase';
import Router from './Router';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isDark, setIsDark] = useState(false);
  const user = useAuthUser(['user'], auth);

  if (user.isLoading) {
    return <div />;
  }

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
