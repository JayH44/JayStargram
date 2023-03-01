import { useAuthUser } from '@react-query-firebase/auth';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import MessageItem from '../Messages/MessageItem';
import { BiPlusCircle } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import Input from '../common/Input';

function Message() {
  console.log('ms');

  const { isLoading: userLoading, data: user } = useAuthUser('authUser', auth);
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const currentUserRef = doc(dbFirebase, 'users', user?.uid ?? '');
  const currentUserQuery = useFirestoreDocument(
    ['currentUser', user?.uid],
    currentUserRef,
    {
      subscribe: true,
    }
  );
  const currentUser = currentUserQuery.data?.data();
  const { chatRoomId, name, id: currentUserId } = currentUser ?? {};

  const currentUserMutation = useFirestoreDocumentMutation(currentUserRef, {
    merge: true,
  });

  const newChatRoomId = uuidv4();
  const newChatRoomRef = doc(dbFirebase, 'messages', newChatRoomId);
  const newChatRoomMutation = useFirestoreDocumentMutation(newChatRoomRef, {
    merge: true,
  });

  if (userLoading || currentUserQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  const handleChatRoom = () => {
    if (!text) {
      alert('채팅방 이름을 입력해주세요');
      return;
    }

    if (!window.confirm('채팅방을 만드시겠습니까?')) {
      return;
    }

    const created = new Date(Date.now());
    newChatRoomMutation.mutate(
      {
        chatRoomId: newChatRoomId,
        chatRoomName: text,
        chatUsers: [currentUserId],
        created,
      },
      {
        onSuccess() {
          currentUserMutation.mutate(
            {
              chatRoomId: chatRoomId.concat(newChatRoomId),
            },
            {
              onSuccess() {
                navigate(newChatRoomId);
              },
            }
          );
        },
      }
    );
  };

  return (
    <Container>
      <MessageTop>
        <h2>{name}님의 채팅방</h2>
        <Input
          value={text}
          active={text.length > 0}
          customplaceholder='방제목을 입력해 주세요'
          onChange={(e) => setText(e.target.value)}
        />
        <button type='button' onClick={handleChatRoom}>
          <BiPlusCircle />
        </button>
      </MessageTop>
      <ChatRoomList>
        {chatRoomId &&
          chatRoomId.map((cid: string) => (
            <Link to={cid} key={cid}>
              <MessageItem chatRoomId={cid} userId={currentUserId} />
            </Link>
          ))}
      </ChatRoomList>
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

const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

Message.defaultProps = {};

export default Message;
