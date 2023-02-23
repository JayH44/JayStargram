import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FcHome,
  FcSearch,
  FcEditImage,
  FcPortraitMode,
  FcMms,
} from 'react-icons/fc';
import { auth } from '../firebase';

type HeaderProps = {};

function Header() {
  const user = auth.currentUser;
  return (
    <Container>
      <Wrapper>
        <h2>JayStargram</h2>
        <GnbList>
          <li>
            <Link to='/home'>
              <FcHome />
            </Link>
          </li>
          <li>
            <Link to='/post'>
              <FcSearch />
            </Link>
          </li>
          <li>
            <Link to='/post/edit'>
              <FcEditImage />
            </Link>
          </li>
          <li>
            <Link to='/profile'>
              {user?.photoURL ? (
                <img src={user?.photoURL} alt={user?.displayName ?? '유저'} />
              ) : (
                <FcPortraitMode />
              )}
            </Link>
          </li>
          <li>
            <Link to='/message'>
              <FcMms />
            </Link>
          </li>
        </GnbList>
      </Wrapper>
    </Container>
  );
}
const Container = styled.div`
  background-color: ${({ theme }) => theme.bgColor};
`;

const Wrapper = styled.div`
  min-width: ${({ theme }) => theme.pageSmallWidth};
  max-width: ${({ theme }) => theme.pageWidth};

  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin: 0 auto;
  height: 40px;
  border-bottom: 1px solid black;

  h2 {
    display: flex;
    align-items: center;

    font-size: 1.2rem;
    font-weight: 700;
  }

  @media (min-width: 800px) {
    max-width: ${({ theme }) => theme.pageWidth};
  }
`;

const GnbList = styled.ul`
  display: flex;
  align-items: center;
  gap: 15px;

  li {
    display: flex;
    justify-content: center;
    align-items: center;
    display: block;

    svg {
      width: 25px;
      height: 100%;
    }

    img {
      width: 25px;
      height: 25px;
      border-radius: 10px;
    }
  }
`;

Header.defaultProps = {};

export default Header;
