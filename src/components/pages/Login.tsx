import React, { useState } from 'react';
import styled from 'styled-components';
import Form from '../common/Form';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../../api/firebaseapi';
import { auth } from '../../firebase';
import { useAuthSignInWithEmailAndPassword } from '@react-query-firebase/auth';

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
  const [inputs, setInputs] = useState<InputsInitial>(InputInitialData);
  const { email, password } = inputs;

  const mutation = useAuthSignInWithEmailAndPassword(auth, {
    onSuccess({ user }) {
      alert('환영합니다 ' + user.displayName + '님');
      navigate('/profile');
    },
    onError(error) {
      alert('로그인 처리중에 오류가 발생했습니다.');
    },
  });

  const validateInput = (value: string, name: string) => {
    if (value === '') {
      alert(name + ' 입력해주세요');
      return false;
    }
    return true;
  };

  //로그인 폼 전송
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !validateInput(email, '이메일을') ||
      !validateInput(password, '비밀번호를')
    )
      return;

    mutation.mutate({ email, password });
  };

  //구글 로그인
  const handleGoogle = () => {
    googleLogin().then((res) => {
      alert('환영합니다.');
      navigate('/profile');
    });
  };
  return (
    <Container>
      <Form
        title='Login'
        InputData={LoginData}
        inputs={inputs}
        setInputs={setInputs}
        onSubmit={handleSubmit}
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
