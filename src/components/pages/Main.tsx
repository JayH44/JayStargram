import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import { auth } from '../../firebase';
import { useAuthUser } from '@react-query-firebase/auth';

type MainProps = {};

function Main() {
  const navigate = useNavigate();
  const user = useAuthUser(['user'], auth, {
    onSuccess(user) {
      if (!user) {
        alert('조회결과 유저정보를 얻을수 없습니다. 로그인창으로 이동합니다.');
        navigate('/login');
      }
    },
    onError(error) {
      alert('유저정보를 얻는데 실패했습니다.');
      navigate('/login');
    },
  });
  console.log(user);
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
