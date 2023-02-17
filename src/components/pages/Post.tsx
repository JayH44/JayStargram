import React from 'react';
import styled from 'styled-components';
import { useFetchPostsQuery } from '../../redux/user';

type PostProps = {};

function Post() {
const query = useFetchPostsQuery();

console.log(query);

  return <Container>Post</Container>;
}
const Container = styled.div``;

Post.defaultProps = {};

export default Post;
