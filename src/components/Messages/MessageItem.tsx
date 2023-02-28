import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';
import { BsInfoCircle, BsPersonFill } from 'react-icons/bs';

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
  const chatRoom = chatRoomQuery?.data?.data();
  const { chatRoomName, chatUsers } = chatRoom ?? {};

  const chatRoomMutation = useFirestoreDocumentMutation(chatRoomRef, {
    merge: true,
  });

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

  let newChatUsers;
  if (chatUsers?.length > 1) {
    newChatUsers = chatUsers.filter((uid: string) => uid !== userId);
    // newChatUsers = chatUsers;
    // newChatUsers.push('AaIAFpTPXDXfaaUKtYXNY7pPLU23');
    // newChatUsers.push('WERtgDdberX9ynZp8uDBnKlrgOW2');
  } else {
    newChatUsers = [];
  }

  if (chatRoomQuery.isLoading || messageQuery.isLoading) {
    return <div>채팅방 목록을 불러오는 중입니다...</div>;
  }

  return (
    <Container>
      <ProfileBoxContainer>
        {newChatUsers?.length > 0 ? (
          newChatUsers.map((uid: string) => (
            <ProfileBox
              key={uid}
              userId={uid}
              imgOnly
              userNum={newChatUsers?.length}
            />
          ))
        ) : (
          <BsInfoCircle />
        )}
      </ProfileBoxContainer>
      <ChatRoomBoxContainer>
        <ChatRoomInfo>
          {newChatUsers?.length > 0 &&
            newChatUsers.map((uid: string) => (
              <ProfileBox key={uid} userId={uid} nameOnly />
            ))}
          <BsPersonFill />
          <p>{newChatUsers?.length}</p>
        </ChatRoomInfo>
        <RecentMsgContainer>
          {!messageQuery.data?.empty && messageQuery.data?.docs[0].data().text}
        </RecentMsgContainer>
      </ChatRoomBoxContainer>
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

const ProfileBoxContainer = styled.div`
  min-width: 40px;
  min-height: 40px;
  position: relative;

  div {
    position: absolute;
  }

  div:nth-child(1) {
    top: 0;
    left: 0;
  }

  div:nth-child(2) {
    bottom: -5px;
    right: -5px;
  }

  div:nth-child(3) {
    bottom: -5px;
    left: 0;
  }

  div:nth-child(4) {
    top: 0;
    right: -7px;
  }

  svg {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 25px;
    height: 25px;
  }
`;
const ChatRoomBoxContainer = styled.div`
  width: 90%;
`;

const ChatRoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    width: 15px;
    height: 15px;
  }
`;
const RecentMsgContainer = styled.div`
  width: 100%;
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

MessageItem.defaultProps = {};

export default MessageItem;
