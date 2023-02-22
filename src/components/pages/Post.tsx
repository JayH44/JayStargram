import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Serach from '../common/Serach';

type PostProps = {};

function Post() {
  return (
    <Container>
      <Serach />
      <Outlet />
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
`;

Post.defaultProps = {};

export default Post;
