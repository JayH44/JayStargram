import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import { useGetUserQuery } from '../../redux/user';

type MainProps = {};

function Main() {
  const { data, isLoading, isError } = useGetUserQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    alert('유저정보가 없습니다. 로그인창으로 이동합니다.');
    navigate('/login');
  }

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
