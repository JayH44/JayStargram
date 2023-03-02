import {
  useFirestoreDocument,
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation,
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
import styled, { css } from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import PostDetailItem from '../Post/PostDetailItem';
import { BiMenu } from 'react-icons/bi';
import {
  BsChatRight,
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs';
import { getTimeElapsed } from '../Post/postfunction';
import Comment from '../Post/Comment';
import { useAuthUser } from '@react-query-firebase/auth';

type PostDetailProps = {
  postIdParam?: string;
  userIdParam?: string;
};

function PostDetail({ postIdParam, userIdParam }: PostDetailProps) {
  console.log('pd');

  const { id } = useParams();
  const postId = postIdParam || id;
  const { search } = useLocation();
  const userId = userIdParam || new URLSearchParams(search).get('userId');
  const { data: user } = useAuthUser(['authUser'], auth);
  const [isOwner, setIsOwner] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isClicked, setIsCliked] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const postRef = query(
    collectionGroup(dbFirebase, 'subposts'),
    where('postId', '==', postId)
  );
  const postQuery = useFirestoreQuery(
    ['post', { id: postId, isLiked }],
    postRef,
    { subscribe: true }
  );
  const data = postQuery.data?.docs[0].data();

  const userRef = doc(dbFirebase, 'users', userId ?? '');
  const userQuery = useFirestoreDocument(['user', userId], userRef);
  const { photo: userPhoto, name: userName } = userQuery.data?.data() ?? {};

  const currentUserRef = doc(collection(dbFirebase, 'users'), user?.uid);
  const currentUserQuery = useFirestoreDocument(
    ['currentUser', user?.uid],
    currentUserRef,
    {
      subscribe: true,
    }
  );
  const bookmarkPostIdArr = currentUserQuery.data?.data()?.bookmarkPostIdArr;
  const currentUserMutation = useFirestoreDocumentMutation(currentUserRef, {
    merge: true,
  });

  const docref = doc(
    collection(dbFirebase, `posts/${userId}/subposts`),
    postId
  );
  const deleteMutation = useFirestoreDocumentDeletion(docref, {
    onSuccess() {
      alert('문서 삭제가 성공하였습니다.');
      navigate('/post');
    },
  });

  const likeMutation = useFirestoreTransaction(dbFirebase, async (tsx) => {
    console.log(docref);
    const doc = await tsx.get(docref);
    const likeUserArr = doc.data()?.likeUserArr;

    const newlikeUserArr = isLiked
      ? likeUserArr.filter((id: string) => id !== user?.uid)
      : likeUserArr.concat(user?.uid);

    tsx.update(docref, {
      likes: newlikeUserArr.length,
      likeUserArr: newlikeUserArr,
    });
  });

  useEffect(() => {
    if (user?.uid === userId) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [user?.uid, userId]);

  useEffect(() => {
    if (!currentUserQuery.isLoading && !bookmarkPostIdArr) {
      alert('프로필 등록을 해주세요');
      navigate('/profile');
    }
  }, [currentUserQuery.isLoading, bookmarkPostIdArr, navigate]);

  useEffect(() => {
    if (data?.likeUserArr.indexOf(user?.uid) === -1) {
      setIsLiked(false);
    } else if (data?.likeUserArr.indexOf(user?.uid) > -1) {
      setIsLiked(true);
    }
  }, [data, user?.uid]);

  useEffect(() => {
    if (bookmarkPostIdArr) {
      const isBooked = bookmarkPostIdArr.filter(
        (bookmark: { postId: string }) => bookmark.postId === postId
      );
      if (isBooked?.length === 0) {
        setIsBookmarked(false);
      } else if (isBooked?.length) {
        setIsBookmarked(true);
      }
    }
  }, [bookmarkPostIdArr, postId]);

  const handleDelete = () => {
    if (user?.uid === userId && window.confirm('삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsCliked(true);
    setTimeout(() => setIsCliked(false), 2000);
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    const newPostIds = isBookmarked
      ? bookmarkPostIdArr.filter(
          (bid: { postId: string }) => bid.postId !== postId
        )
      : bookmarkPostIdArr.concat({
          postId,
          userId,
          created: data?.created,
        });

    currentUserMutation.mutate(
      {
        bookmarkPostIdArr: newPostIds,
      },
      {
        onSuccess() {
          setIsBookmarked(!isBookmarked);
        },
      }
    );
  };

  if (postQuery.isLoading || userQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!postId || !data) return <div>Loading...</div>;

  return (
    <Container>
      <AuthorBox>
        <ProfileContainer onClick={() => navigate(`/author/${userId}`)}>
          <img src={userPhoto} alt={userName} />
          <p>{userName}</p>
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
                <li onClick={handleBookmark}>즐겨찾기</li>
              )}
            </MenuList>
          )}
        </MenuContainer>
      </AuthorBox>
      <PostDetailItem data={data} onDoubleClick={handleLike} />
      <PostSideBox>
        <ButtonContainer>
          <div>
            {isLiked ? (
              <BsHeartFill onClick={handleLike} />
            ) : (
              <BsHeart onClick={handleLike} />
            )}
            <BsChatRight onClick={() => setDropdown(!dropdown)} />
          </div>
          {isBookmarked ? (
            <BsBookmarkFill onClick={handleBookmark} />
          ) : (
            <BsBookmark onClick={handleBookmark} />
          )}
        </ButtonContainer>
        <SideInfo>
          <p>좋아요: {data.likeUserArr.length}개,</p>
          <p>{getTimeElapsed(data.created.seconds)} 작성됨</p>
        </SideInfo>
      </PostSideBox>
      <PostTextBox>{data.text}</PostTextBox>
      <Comment
        id={postId ?? ''}
        dropdown={dropdown}
        setDropdown={setDropdown}
      />
      <LikeBox isClicked={isClicked}>
        {isLiked ? <BsHeartFill /> : <BsHeart />}
      </LikeBox>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: ${({ theme }) => theme.pageWidth};
  width: 100%;
  position: relative;
  user-select: none;
`;

const AuthorBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 30px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 30px;

  cursor: pointer;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  p {
    font-weight: 700;
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
    border-radius: 50%;

    &:hover {
      background-color: #bbb;
    }
  }
`;

const MenuList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  width: 100%;
  background-color: ${({ theme }) => theme.bgColor};
  border-radius: 10px;
  overflow: hidden;

  li {
    width: 100%;
    padding: 5px;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }
  }
`;

const PostSideBox = styled.div``;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    height: ${({ theme }) => theme.comHeight};
  }

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

const LikeBox = styled.div<{ isClicked: boolean }>`
  position: absolute;
  opacity: 0;
  top: 250px;
  left: 45%;

  ${({ isClicked }) =>
    isClicked &&
    css`
      animation: onoff 2s ease-in-out;
    `}

  @keyframes onoff {
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  svg {
    width: 50px;
    height: 50px;
  }
`;

PostDetail.defaultProps = {};

export default PostDetail;
