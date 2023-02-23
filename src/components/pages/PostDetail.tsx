import {
  useFirestoreDocumentDeletion,
  useFirestoreQuery,
  useFirestoreTransaction,
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
import { BiMenu, BiLike, BiComment } from 'react-icons/bi';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { getTimeElapsed } from '../Post/postfunction';

type PostDetailProps = {};

function PostDetail() {
  const { id } = useParams();
  const { search } = useLocation();
  const userId = new URLSearchParams(search).get('userId');
  const user = auth.currentUser;
  const [isOwner, setIsowner] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    where('postId', '==', id)
  );
  const postQuery = useFirestoreQuery(['post', { id, isLiked }], ref, {
    subscribe: true,
  });

  const docref = doc(collection(dbFirebase, `posts/${userId}/subposts`), id);
  const deleteMutation = useFirestoreDocumentDeletion(docref, {
    onSuccess() {
      alert('문서 삭제가 성공하였습니다.');
      navigate('/post');
    },
  });

  const likeMutation = useFirestoreTransaction(
    dbFirebase,
    async (tsx) => {
      const doc = await tsx.get(docref);
      const num = isLiked ? -1 : 1;
      const newLikes = doc.data()?.likes + num;
      tsx.update(docref, {
        likes: newLikes,
      });
      return newLikes;
    },
    {
      onSuccess() {
        postQuery.refetch();
      },
    }
  );

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
      deleteMutation.mutate();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    likeMutation.mutate();
  };

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
              <PostSideBox>
                <ButtonContainer>
                  {isLiked ? (
                    <BsHeartFill onClick={handleLike} />
                  ) : (
                    <BsHeart onClick={handleLike} />
                  )}
                  <BiComment />
                </ButtonContainer>
                <SideInfo>
                  <p>{getTimeElapsed(data.created.seconds)},</p>
                  <p>좋아요: {data.likes}</p>
                </SideInfo>
              </PostSideBox>
              <PostTextBox>{data.text}</PostTextBox>
              <CommentBox>댓글창</CommentBox>
            </Container>
          );
        })}
    </>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
  gap: 10px;
`;

const AuthorBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 40px;

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
  background-color: rgba(255, 255, 255, 0.6);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  li {
    width: 100%;
    padding: 5px;
    cursor: pointer;
  }
`;

const PostSideBox = styled.div``;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: ${({ theme }) => theme.comHeight};
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const SideInfo = styled.div`
  display: flex;
  gap: 10px;
  font-weight: 600;
`;

const PostTextBox = styled.div``;
const CommentBox = styled.div``;

PostDetail.defaultProps = {};

export default PostDetail;
