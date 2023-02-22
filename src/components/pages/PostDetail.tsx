import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';

type PostDetailProps = {};

function PostDetail() {
  const id = useParams();
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    where('postId', '==', id)
  );

  const postQuery = useFirestoreQuery(['posts'], ref);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = postQuery.data;
  console.log(snapshot);

  return <Container></Container>;
}
const Container = styled.div``;

PostDetail.defaultProps = {};

export default PostDetail;
