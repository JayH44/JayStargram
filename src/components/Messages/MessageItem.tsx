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
import { BsInfoCircle } from 'react-icons/bs';

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

  if (chatRoomQuery.isLoading || messageQuery.isLoading) {
    return <div>채팅방 목록을 불러오는 중입니다...</div>;
  }

  console.log(messageQuery.data);

  // if (!messageQuery.data?.empty) {
  //   chatRoomMutation.mutate(
  //     {
  //       lastMsgTime: messageQuery.data?.docs[0].data().created,
  //     },
  //     {
  //       onSuccess() {
  //         console.log(messageQuery.data?.docs[0].data().created);
  //       },
  //     }
  //   );
  // }

  return (
    <Container>
      {chatUsers.length > 0 ? (
        <ProfileBox userId={chatUsers[0]} imgOnly />
      ) : (
        <BsInfoCircle />
      )}
      <p>
        {chatRoomName}:{' '}
        {!messageQuery.data?.empty && messageQuery.data?.docs[0].data().text}
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

  svg {
    width: 25px;
    height: 25px;
  }
`;

MessageItem.defaultProps = {};

export default MessageItem;
