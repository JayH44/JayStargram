import {
  useFirestoreDocument,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';

type MessageItemProps = {
  chatRoomId: string;
  userId: string;
};

function MessageItem({ chatRoomId, userId }: MessageItemProps) {
  const chatRoomRef = doc(dbFirebase, 'messages/' + chatRoomId);
  const chatRoomQuery = useFirestoreDocument(
    ['chatRoom', chatRoomId],
    chatRoomRef
  );
  const chatRoomName = chatRoomQuery?.data?.data()?.chatRoomName;
  const chatUsers = chatRoomQuery?.data
    ?.data()
    ?.chatUsers.filter((user: string) => user !== userId);

  const messageColl = collection(
    dbFirebase,
    'messages/' + chatRoomId + '/submessages'
  );
  const messageQueryRef = query(
    messageColl,
    orderBy('created', 'desc'),
    limit(1)
  );
  const messageQuery = useFirestoreQuery(
    ['messages/recent', chatRoomId],
    messageQueryRef,
    {
      subscribe: true,
    }
  );

  if (chatRoomQuery.isLoading || messageQuery.isLoading) {
    return <div>채팅방 목록을 불러오는 중입니다...</div>;
  }

  const recentText = messageQuery.data?.docs[0].data().text;

  return (
    <Container>
      <ProfileBox userId={chatUsers[0]} imgOnly />
      <p>
        {chatRoomName}: {recentText}
      </p>
    </Container>
  );
}
const Container = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.bdColor};
  border-radius: 10px;
  padding: 10px;
`;

MessageItem.defaultProps = {};

export default MessageItem;
