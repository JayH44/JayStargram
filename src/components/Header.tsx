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

type HeaderProps = {};

function Header() {
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
            <Link to='/post'>
              <FcEditImage />
            </Link>
          </li>
          <li>
            <Link to='/profile'>
              <FcPortraitMode />
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
  max-width: ${({ theme }) => theme.pageSmallWidth};
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
  }
`;

Header.defaultProps = {};

export default Header;
