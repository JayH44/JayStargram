import React, { useState } from 'react';
import styled from 'styled-components';
import Form from '../common/Form';
import { FcGoogle } from 'react-icons/fc';
import { googleLogin } from '../../api/firebaseapi';
import { useNavigate } from 'react-router-dom';
import { useAuthCreateUserWithEmailAndPassword } from '@react-query-firebase/auth';
import { auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';

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
  const [inputs, setInputs] = useState<InputsInitial>(InputInitialData);
  const { name, email, password } = inputs;
  const mutation = useAuthCreateUserWithEmailAndPassword(auth, {
    onSuccess({ user }) {
      updateProfile(user, {
        displayName: name,
      }).then(() => {
        alert('가입에 성공하셨습니다. ' + name + '님');
        navigate('/login');
      });
    },
    onError(error) {
      alert('Could not sign you up!');
    },
  });

  const validateInput = (value: string, name: string) => {
    if (value === '') {
      alert(name + ' 입력해주세요');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !validateInput(name, '이름을') ||
      !validateInput(email, '이메일을') ||
      !validateInput(password, '비밀번호를')
    )
      return;

    mutation.mutate({ email, password });
  };

  //구글 회원가입
  const handleGoogle = () => {
    googleLogin().then((res) => {
      alert('회원가입에 성공하셨습니다, 로그인페이지로 이동합니다.');
      navigate('/login');
    });
  };
  return (
    <Container>
      <Form
        title='SignUp'
        InputData={SignUpData}
        inputs={inputs}
        setInputs={setInputs}
        onSubmit={handleSubmit}
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
