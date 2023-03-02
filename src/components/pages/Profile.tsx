import { useAuthSignOut, useAuthUser } from '@react-query-firebase/auth';
import { updateProfile } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import Button from '../common/Button';
import ImgCrop from '../common/ImgCrop';
import { deleteFirestore, uploadFirebase } from './../../api/firebaseapi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { collection, doc } from 'firebase/firestore';
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import Input from '../common/Input';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

function Profile() {
  console.log('pf');

  const { data: user } = useAuthUser(['authUser'], auth);
  const [photoURL, setPhotoURL] = useState<string | undefined>(
    user?.photoURL || undefined
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [deleteAction, setDeleteAction] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useAuthSignOut(auth, {
    onSuccess() {
      alert('로그아웃 하셨습니다. 로그인창으로 이동합니다.');
      navigate('/login');
    },
  });

  const ref = doc(collection(dbFirebase, 'users'), user?.uid);
  const userMutation = useFirestoreDocumentMutation(ref, {
    merge: true,
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
    if (e.target.files && user) {
      setOpen(true);
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      setActive(false);
    }
  };

  //크롭이미지 파일 서버 전송및 등록
  const submitImage = async () => {
    if (user) {
      const url = await uploadFirebase(croppedFiles[0], 'profile/' + user.uid);
      setPhotoURL(url);
      await updateProfile(user, {
        photoURL: url,
      });
      userMutation.mutate(
        {
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
          bookmarkPostIdArr: [],
          chatRoomId: [],
        },
        {
          onSuccess() {
            alert('프로필 사진 설정이 완료되었습니다.');
            queryClient.refetchQueries(['currentUser', user.uid, 0]);
            setCroppedFiles([]);
            setFiles([]);
            setDeleteAction(false);
          },
        }
      );
    }
  };
  const handleName = async () => {
    if (!user) return;
    await updateProfile(user, {
      displayName: text,
    });
    userMutation.mutate(
      {
        id: user.uid,
        name: text,
        photo: user.photoURL,
        bookmarkPostIdArr: [],
        chatRoomId: [],
      },
      {
        onSuccess() {
          alert('프로필 이름 설정이 완료되었습니다.');
          queryClient.refetchQueries(['currentUser', user.uid, 0]);
          setText('');
        },
      }
    );
  };

  //프로필이미지 삭제
  const deleteImage = async () => {
    if (user && photoURL) {
      if (window.confirm('사진을 삭제하시겠습니까?')) {
        await deleteFirestore(photoURL);
        setPhotoURL(undefined);
        await updateProfile(user, {
          photoURL: '',
        });
        setDeleteAction(true);
      }
    }
  };

  if (userMutation.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <LeftBox>
        <h1>Profile</h1>
        <ImageContainer
          htmlFor='profileInput'
          active={active}
          onClick={handleClick}>
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
            text='프로필사진 삭제'
            type='button'
            bgColor='blue'
            round
            onClick={deleteImage}></Button>
        ) : (
          <Button
            text='프로필사진 전송'
            type='button'
            bgColor='rgba(0,0,0,0.6)'
            round
            onClick={submitImage}></Button>
        )}
        <Button
          text='Logout'
          type='button'
          round
          onClick={handleLogout}></Button>
      </LeftBox>
      <RightBox>
        <TextInfo>
          <p>
            <b>Username</b> <br />
            {user?.displayName}
          </p>
          <ProfileModBox>
            <Input
              type='text'
              name='name'
              value={text}
              customplaceholder='이름입력'
              active={text.length > 0}
              onChange={(e) => setText(e.target.value)}
            />
            <Button text='이름수정' onClick={handleName} round />
          </ProfileModBox>
          <p>
            <b>E-mail</b> <br />
            {user?.email}
          </p>
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
  margin-left: -10px;
  padding: 10px 0;
  user-select: none;
`;

const LeftBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;

  width: 60%;
  margin-left: -10px;
  gap: 10px;
  h1 {
    text-align: center;
    font-weight: 700;
  }

  button {
    width: 70%;
  }
`;
const ImageContainer = styled.label<{ active: boolean }>`
  width: 70%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 100%;
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
        transform: rotate(135deg);
      `}
  }
`;

const RightBox = styled.div`
  flex-grow: 1;
`;
const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  text-align: center;
  p {
    b {
      font-weight: 700;
    }
  }
`;

const ProfileModBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  div {
    width: 70%;
  }
  button {
    width: 70%;
  }
  input {
    border-radius: 5px;
  }
`;
Profile.defaultProps = {};

export default Profile;
