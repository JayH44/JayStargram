import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

function Message() {
  return (
    <Container>
      <ul>
        <li>
          <Link to='1'>챗방1</Link>
        </li>
        <li>
          <Link to='2'>챗방2</Link>
        </li>
      </ul>
      <Outlet />
    </Container>
  );
}
const Container = styled.div`
  display: flex;
`;

Message.defaultProps = {};

export default Message;
