import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { uploadFirebase } from '../../api/firebaseapi';
import { auth, dbFirebase } from '../../firebase';
import Button from '../common/Button';
import ImgCrop from '../common/ImgCrop';

function PostEdit() {
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const ref = doc(
    collection(dbFirebase, 'posts/', user?.uid ?? '', 'subposts')
  );
  const mutation = useFirestoreDocumentMutation(ref);
  const commentRef = doc(dbFirebase, `comments/${ref.id}`);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      setOpen(true);
    }
  };

  const handleIndex = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    e.stopPropagation();
    setIdx(idx);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text'));
    const draggedImage = croppedFiles[draggedIndex];
    const newImages = croppedFiles.filter((_, i) => i !== draggedIndex);
    newImages.splice(index, 0, draggedImage);
    setCroppedFiles(newImages);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text', index.toString());
  };

  const removeImage = (idx: number) => {
    if (window.confirm('삭제하시겠습니까?')) {
      const newImages = croppedFiles.filter((_, i) => i !== idx);
      setCroppedFiles(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (croppedFiles.length === 0) {
      alert('사진을 첨부해 주세요');
      return;
    }
    if (text === '') {
      alert('글을 작성해 주세요');
      return;
    }
    if (!user) return;

    // const photoURL = croppedFiles.forEach(
    //   async (file) => await uploadFirebase(file, 'posts/' + user?.uid)
    // );

    let photoURL: string[] = [];
    for (let i = 0; i < croppedFiles.length; i++) {
      const res = await uploadFirebase(
        croppedFiles[i],
        `posts/${user?.uid}/${ref.id}`
      );
      photoURL.push(res);
    }

    const created = new Date(Date.now());
    mutation.mutate(
      {
        postId: ref.id,
        userId: user?.uid,
        text,
        photo: photoURL,
        created,
        likes: 0,
        likeUserArr: [],
      },
      {
        async onSuccess() {
          alert('글이 성공적으로 저장되었습니다.');
          await setDoc(commentRef, {
            commentArr: [],
          });
          navigate('/post/' + ref.id + `?userId=${user?.uid}`);
        },
        onError(error) {
          alert('업로드에 실패하였습니다.');
        },
      }
    );
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

  return (
    <Container onSubmit={handleSubmit}>
      <Preview htmlFor='image' onClick={() => setActive(true)}>
        <input
          type='file'
          multiple
          hidden
          id='image'
          onChange={handleImage}
          accept='image/*'
        />
        <PreviewWrapper
          active={active}
          idx={idx}
          isPicture={croppedFiles.length > 0}
        >
          {croppedFiles.length > 0 ? (
            croppedFiles.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt={`[${idx}]`} />
            ))
          ) : (
            <IoMdAddCircleOutline />
          )}
        </PreviewWrapper>
        <BtnBox>
          {croppedFiles.length > 0 &&
            croppedFiles.map((_, idx) => (
              <div key={idx} onClick={(e) => handleIndex(e, idx)}></div>
            ))}
        </BtnBox>
      </Preview>
      <Post onChange={(e) => setText(e.target.value)} value={text} />
      <Button text='등록' type='submit' round disabled={mutation.isLoading} />
      <PreviewSmall>
        {croppedFiles.length > 0 &&
          croppedFiles.map((file, idx) => (
            <ImgBox key={idx}>
              <img
                src={URL.createObjectURL(file)}
                alt={`[${idx + 1}]`}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, idx)}
                onClick={() => setIdx(idx)}
              />
              <IdxBox>
                <p>{idx + 1}</p>
                <button onClick={() => removeImage(idx)}>삭제</button>
              </IdxBox>
            </ImgBox>
          ))}
      </PreviewSmall>
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
const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
`;

const Preview = styled.label`
  width: ${({ theme }) => theme.comWidth};
  height: 200px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.bdColor};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
`;

const PreviewWrapper = styled.div<{
  active: boolean;
  idx: number;
  isPicture: boolean;
}>`
  display: flex;
  height: 100%;
  transform: translateX(${({ idx }) => -idx * 100}%);
  transition: transform 0.4s;

  ${({ isPicture }) =>
    !isPicture &&
    css`
      align-items: center;
      justify-content: center;
    `}

  img {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }

  svg {
    width: 50%;
    height: 50%;
    transform: rotate(0);
    transition: transform 0.4s;

    ${({ active }) =>
      active &&
      css`
        transform: rotate(45deg);
      `}
  }
`;

const BtnBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  cursor: pointer;

  div {
    width: 10px;
    height: 10px;
    background-color: black;
    border-radius: 50%;
  }
`;

const Post = styled.textarea`
  width: ${({ theme }) => theme.comWidth};
  height: 200px;
  border-radius: 10px;
  padding: 15px;
  font-size: 0.9rem;
  outline: none;
  resize: none;
  background: transparent;
`;

const PreviewSmall = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px;
  cursor: pointer;
`;

const ImgBox = styled.div`
  img {
    display: block;
    border: 2px solid black;
    width: 100px;
    height: 100px;
  }
`;
const IdxBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  gap: 10px;

  button {
    background-color: red;
    color: white;
  }
`;

PostEdit.defaultProps = {};

export default PostEdit;
