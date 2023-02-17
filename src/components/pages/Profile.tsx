import React from 'react';
import styled from 'styled-components';
import { useGetUserQuery } from '../../redux/user';
import ImgCrop from '../common/ImgCrop';

type ProfileProps = {};

function Profile() {
  const { data, isLoading, isError } = useGetUserQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Container>
      <h1>Profile</h1>
      <p>Email: {data?.email}</p>
      <p>UID: {data?.uid}</p>
      <ImgCrop />
    </Container>
  );
}
const Container = styled.div``;

Profile.defaultProps = {};

export default Profile;
