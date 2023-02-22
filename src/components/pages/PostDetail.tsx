import {
  useFirestoreDocumentDeletion,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import {
  collection,
  collectionGroup,
  doc,
  query,
  where,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import PostDetailItem from '../Post/PostDetailItem';
import { BiMenu } from 'react-icons/bi';

type PostDetailProps = {};

function PostDetail() {
  const { id } = useParams();
  const { search } = useLocation();
  const userId = new URLSearchParams(search).get('userId');
  const user = auth.currentUser;
  const navigate = useNavigate();
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    where('postId', '==', id)
  );
  const postQuery = useFirestoreQuery(['post', id], ref);
  const [isOwner, setIsowner] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const docref = doc(collection(dbFirebase, `posts/${userId}/subposts`), id);
  const docMutation = useFirestoreDocumentDeletion(docref, {
    onSuccess() {
      alert('문서 삭제가 성공하였습니다.');
      navigate('/post');
    },
  });

  useEffect(() => {
    if (user?.uid === userId) {
      setIsowner(true);
    } else {
      setIsowner(false);
    }
  }, [user?.uid, userId]);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = postQuery.data;

  const handleDelete = () => {
    if (user?.uid === userId && window.confirm('삭제하시겠습니까?')) {
      docMutation.mutate();
    }
  };

  console.log('isShow', isShow);

  return (
    <>
      {snapshot &&
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return (
            <Container key={docSnapshot.id}>
              <AuthorBox>
                <ProfileContainer>
                  <img src={data.userPhoto} alt={data.name} />
                  <p>{data.name}</p>
                </ProfileContainer>
                <MenuContainer onClick={() => setIsShow(!isShow)}>
                  <BiMenu />
                  {isShow && (
                    <MenuList>
                      {isOwner ? (
                        <>
                          <li onClick={handleDelete}>삭제</li>
                          <li>수정</li>
                        </>
                      ) : (
                        <li>즐겨찾기</li>
                      )}
                    </MenuList>
                  )}
                </MenuContainer>
              </AuthorBox>
              <PostDetailItem data={data} />
              <PostTextBox>{data.text}</PostTextBox>
            </Container>
          );
        })}
    </>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AuthorBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 40px;

  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 40px;

  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const MenuContainer = styled.div`
  position: relative;
  cursor: pointer;
  width: 100px;
  display: flex;
  justify-content: flex-end;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const MenuList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  width: 100%;

  li {
    width: 100%;
    background-color: black;
    height: 100vh;
  }
`;

const PostTextBox = styled.div``;

PostDetail.defaultProps = {};

export default PostDetail;
