import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

type MainProps = {};

function Main() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (!user) {
    alert('유저정보가 없어서 로그인창으로 이동합니다');
  }

  return user ? (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  ) : (
    <Navigate to='/login' />
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

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
Main.defaultProps = {};

export default Main;
