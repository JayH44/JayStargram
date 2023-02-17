import React from 'react';
import styled from 'styled-components';
import Form from '../common/Form';

type SignUpProps = {};
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
  return (
    <Container>
      <Form
        title='SignUp'
        InputData={SignUpData}
        InputInitialData={InputInitialData}
      />
    </Container>
  );
}

const Container = styled.div``;

SignUp.defaultProps = {};

export default SignUp;
