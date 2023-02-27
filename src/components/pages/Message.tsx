import { useAuthUser } from '@react-query-firebase/auth';
import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import MessageItem from '../Messages/MessageItem';
import { BiPlusCircle } from 'react-icons/bi';

function Message() {
  const { isLoading: userLoading, data: user } = useAuthUser('authUser', auth);
  const currentUserRef = doc(dbFirebase, 'users', user?.uid ?? '');
  const currentUserQuery = useFirestoreDocument(
    ['users', user?.uid],
    currentUserRef
  );

  const chatRoomId = currentUserQuery.data?.data()?.chatRoomId;
  const name = currentUserQuery.data?.data()?.name;
  const id = currentUserQuery.data?.data()?.id;

  if (userLoading || currentUserQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  const handleChatRoom = () => {
    if (!window.confirm('채팅방을 만드시겠습니까?')) {
      return;
    }
  };

  return (
    <Container>
      <MessageTop>
        <h2>{name}님의 채팅방</h2>
        <button type='button' onClick={handleChatRoom}>
          <BiPlusCircle />
        </button>
      </MessageTop>
      <ul>
        {chatRoomId &&
          chatRoomId.map((cid: string) => (
            <Link to={cid} key={cid}>
              <MessageItem chatRoomId={cid} userId={id} />
            </Link>
          ))}
      </ul>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;

  ul {
    width: 100%;
  }
`;

const MessageTop = styled.div`
  display: flex;
  justify-content: space-between;

  svg {
    width: 25px;
    height: 25px;
  }
`;

Message.defaultProps = {};

export default Message;
