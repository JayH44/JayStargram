import React, { useState } from 'react';
import styled from 'styled-components';
import { logoutFirebase } from '../../api/firebaseapi';
import { auth } from '../../firebase';
import { useGetCurrentUserQuery } from '../../redux/user';
import ImgCrop from '../common/ImgCrop';
import { uploadFirebase } from './../../api/firebaseapi';

type ProfileProps = {};

function Profile() {
  const user = auth.currentUser;
  const [photoURL, setPhotoURL] = useState<string | undefined>(
    user?.photoURL || undefined
  );
  const handleLogout = () => {
    logoutFirebase();
    window.location.reload();
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFirebase(e.target.files[0], 'profile').then(setPhotoURL);
    }
  };

  return (
    <Container>
      <h1>Profile</h1>
      <input
        type='file'
        accept='image/*'
        id='profileInput'
        hidden
        onChange={handleImage}
      />
      <ImageContainer htmlFor='profileInput'>
        {photoURL ? <img src={photoURL} alt='profile' /> : <div>+</div>}
      </ImageContainer>
      <p>Email: {user?.email}</p>
      <p>UID: {user?.uid}</p>
      <button onClick={handleLogout}>Logout</button>
      <ImgCrop />
    </Container>
  );
}
const Container = styled.div``;
const ImageContainer = styled.label`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  img {
    width: 100%;
  }
`;

Profile.defaultProps = {};

export default Profile;
