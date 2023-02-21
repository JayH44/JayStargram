import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useFetchPostsQuery } from '../../redux/user';

type PostProps = {};

function Post() {
  const query = useFetchPostsQuery();

  console.log(query);

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
