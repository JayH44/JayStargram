import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collection, query } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';

type SerachResultsProps = {
  input: string;
};

function SerachResults({ input }: SerachResultsProps) {
  const ref = query(collection(dbFirebase, 'users'));
  const userQuery = useFirestoreQuery(['users'], ref, {
    subscribe: true,
  });
  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = userQuery.data;

  return (
    <Container>
      {snapshot &&
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          console.log(data);
          return (
            <SerachItem key={docSnapshot.id}>
              <img src={data.photo} alt={data.name} />
              <span>{data.name}</span>
            </SerachItem>
          );
        })}
    </Container>
  );
}
const Container = styled.ul`
  position: absolute;
  z-index: 10;
  width: ${({ theme }) => theme.comWidth};
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 10px;
`;
const SerachItem = styled.li`
  display: flex;
  gap: 10px;
  height: 30px;

  padding: 0 5px;
  margin-top: 5px;

  cursor: pointer;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
SerachResults.defaultProps = {};

export default SerachResults;
