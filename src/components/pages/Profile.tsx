import React from 'react';
import styled from 'styled-components';
import { logoutFirebase } from '../../api/firebaseapi';
import { auth } from '../../firebase';
import { useGetCurrentUserQuery } from '../../redux/user';
import ImgCrop from '../common/ImgCrop';

type ProfileProps = {};

function Profile() {
  const user = auth.currentUser;
  const photoURL = user?.photoURL || undefined;
  const handleLogout = () => {
    logoutFirebase();
    window.location.reload(); 
  }
  return (
    <Container>
      <h1>Profile</h1>
      {photoURL && <img src={photoURL} alt="profile" />}
      <p>Email: {user?.email}</p>
      <p>UID: {user?.uid}</p>
      <button onClick={handleLogout}>Logout</button>
      <ImgCrop />
    </Container>
  );
}
const Container = styled.div``;

Profile.defaultProps = {};

export default Profile;
