import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import { auth } from '../../firebase';
import { useAuthUser } from '@react-query-firebase/auth';

function Main() {
  const user = useAuthUser(['authUser'], auth);

  if (user.isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  console.log(user);

  if (!user.data) {
    alert('유저정보가 없어서 로그인창으로 이동합니다');
  }

  return user.data ? (
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
  max-width: ${({ theme }) => theme.pageWidth};

  margin: 0 auto;
  padding: 40px 10px;
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
