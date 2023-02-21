import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

type PostProps = {};

function Post() {
  return (
    <Container>
      Post
      <Outlet />
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

Post.defaultProps = {};

export default Post;
