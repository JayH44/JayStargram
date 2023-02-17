import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';

type MainProps = {};

function Main() {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
const Container = styled.div`
  max-width: ${({ theme }) => theme.pageSmallWidth};

  margin: 0 auto;
  padding: 0 10px;
  background-color: ${({ theme }) => theme.bgColor};

  @media (min-width: 800px) {
    max-width: ${({ theme }) => theme.pageWidth};
  }
`;

Main.defaultProps = {};

export default Main;
