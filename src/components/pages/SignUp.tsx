import React from 'react';
import styled from 'styled-components';
import Form from '../common/Form';
import { FcGoogle } from 'react-icons/fc';
import { googleLogin } from '../../api/firebaseapi';
import { useNavigate } from 'react-router-dom';

export type InputsInitial = {
  [index: string]: string;
};

const SignUpData = [
  { type: 'name', text: 'name', placeholder: '이름을 입력해주세요' },
  {
    type: 'text',
    text: 'email',
    placeholder: '이메일을 입력해 주세요',
  },
  {
    type: 'password',
    text: 'password',
    placeholder: '비밀번호를 입력해 주세요',
  },
];

const InputInitialData = {
  name: ``,
  email: ``,
  password: ``,
};

function SignUp() {
  const navigate = useNavigate();

  //구글 회원가입
  const handleGoogle = () => {
    googleLogin().then((res) => {
      console.log('result', res);
      alert('회원가입에 성공하셨습니다, 로그인페이지로 이동합니다.');
      navigate('/login');
    });
  };
  return (
    <Container>
      <Form
        title='SignUp'
        InputData={SignUpData}
        InputInitialData={InputInitialData}
      />
      <GoogleLogin onClick={handleGoogle}>
        <FcGoogle />
        <p>Subscribe with Google</p>
      </GoogleLogin>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: ${({ theme }) => theme.pageSmallHeight};
`;
const GoogleLogin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: ${({ theme }) => '250px' || theme.comWidth};
  height: ${({ theme }) => '40px' || theme.comHeight};
  background-color: red;
  color: white;
  cursor: pointer;
`;

export default SignUp;