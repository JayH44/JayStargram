import React from 'react';
import styled from 'styled-components';
import Form from '../common/Form';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../../api/firebaseapi';

export type InputsInitial = {
  [index: string]: string;
};

const LoginData = [
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
  email: ``,
  password: ``,
};

function Login() {
  const navigate = useNavigate();

  //구글 로그인
  const handleGoogle = () => {
    googleLogin().then((res) => {
      console.log('result', res);
      alert('환영합니다.');
      navigate('/home');
    });
  };
  return (
    <Container>
      <Form
        title='Login'
        InputData={LoginData}
        InputInitialData={InputInitialData}
      />
      <GoogleLogin onClick={handleGoogle}>
        <FcGoogle />
        <p>Login with Google</p>
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

export default Login;
