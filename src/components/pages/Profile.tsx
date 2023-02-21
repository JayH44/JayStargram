import { useAuthSignOut } from '@react-query-firebase/auth';
import { updateProfile } from 'firebase/auth';
import React, { useRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { auth } from '../../firebase';
import Button from '../common/Button';
import ImgCrop from '../common/ImgCrop';
import { deleteFirestore, uploadFirebase } from './../../api/firebaseapi';
import { IoMdAddCircleOutline } from 'react-icons/io';

type ProfileProps = {};

function Profile() {
  const user = auth;
  const [photoURL, setPhotoURL] = useState<string | undefined>(
    user.currentUser?.photoURL || undefined
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [deleteAction, setDeleteAction] = useState(false);
  const logoutMutation = useAuthSignOut(auth, {
    onSuccess() {
      alert('로그아웃 되었습니다.');
      window.location.reload();
    },
  });

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) logoutMutation.mutate();
  };

  //사진 추가시 클릭 애니메이션 스테이트
  const handleClick = () => {
    setActive(true);
  };

  //Input Cancel시 애니메이션 원래대로
  useEffect(() => {
    const listen = () => {
      setTimeout(() => setActive(false), 1000);
    };
    if (active) {
      window.addEventListener('focus', listen);
    } else {
      return window.removeEventListener('focus', listen);
    }
  }, [active]);

  //이미지 파일리스트 배열로 저장
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && user.currentUser) {
      setOpen(true);
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      setActive(false);
    }
  };

  //크롭이미지 파일 서버 전송및 등록
  const submitImage = async () => {
    if (user.currentUser) {
      const url = await uploadFirebase(
        croppedFiles[0],
        'profile/' + user.currentUser.uid
      );
      setPhotoURL(url);
      await updateProfile(user.currentUser, {
        photoURL: url,
      });
      alert('프로필 설정이 완료되었습니다.');
      setCroppedFiles([]);
      setFiles([]);
      setDeleteAction(false);
    }
  };

  //프로필이미지 삭제
  const deleteImage = async () => {
    if (user.currentUser && photoURL) {
      if (window.confirm('사진을 삭제하시겠습니까?')) {
        await deleteFirestore(photoURL);
        setPhotoURL(undefined);
        await updateProfile(user.currentUser, {
          photoURL: '',
        });
        setDeleteAction(true);
      }
    }
  };

  return (
    <Container>
      <LeftBox>
        <h1>Profile</h1>
        <ImageContainer
          htmlFor='profileInput'
          active={active}
          onClick={handleClick}
        >
          <input
            type='file'
            accept='image/*'
            id='profileInput'
            hidden
            onChange={handleImage}
          />
          {photoURL || croppedFiles.length > 0 ? (
            <img
              src={photoURL || URL.createObjectURL(croppedFiles[0])}
              alt='profile'
            />
          ) : (
            <IoMdAddCircleOutline />
          )}
        </ImageContainer>
        {croppedFiles.length === 0 && !deleteAction ? (
          <Button
            text='프로필 삭제'
            type='button'
            bgColor='blue'
            round
            handleOnclick={deleteImage}
          ></Button>
        ) : (
          <Button
            text='프로필 전송'
            type='button'
            bgColor='rgba(0,0,0,0.6)'
            round
            handleOnclick={submitImage}
          ></Button>
        )}
        <Button
          text='Logout'
          type='button'
          round
          handleOnclick={handleLogout}
        ></Button>
      </LeftBox>
      <RightBox>
        <TextInfo>
          <p>Username: {user.currentUser?.displayName}</p>
          <p>Email: {user.currentUser?.email}</p>
        </TextInfo>
      </RightBox>
      {open && (
        <ImgCrop
          files={files}
          croppedFiles={croppedFiles}
          setCroppedFiles={setCroppedFiles}
          setOpen={setOpen}
        />
      )}
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;
const ImageContainer = styled.label<{ active: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  img {
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 50%;
    height: 50%;
    transition: transform 0.4s;
    transform: rotate(0);

    ${({ active }) =>
      active &&
      css`
        transform: rotate(-45deg);
      `}
  }
`;
const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  h1 {
    text-align: center;
    font-weight: 700;
  }
`;
const RightBox = styled.div``;
const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Preview = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px;
  img {
    display: block;
    border: 2px solid black;
    width: 100px;
    height: 100px;
  }
`;

Profile.defaultProps = {};

export default Profile;
