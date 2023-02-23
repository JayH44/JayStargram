import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import { auth } from '../../firebase';
import { useAuthUser } from '@react-query-firebase/auth';

type MainProps = {};

function Main() {
  const user = useAuthUser(['user'], auth);

  if (user.isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (!user.data) {
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
  min-width: ${({ theme }) => theme.pageSmallWidth};
  max-width: ${({ theme }) => theme.pageWidth};

  margin: 0 auto;
  padding: 0 10px;
  background-color: ${({ theme }) => theme.bgColor};

  @media (min-width: 800px) {
    max-width: ${({ theme }) => theme.pageWidth};
  }
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
Main.defaultProps = {};

export default Main;
