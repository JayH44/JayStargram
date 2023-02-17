import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loginFirebase, signUpFirebase } from '../../api/firebaseapi';
import { InputsInitial } from '../pages/SignUp';
import Button from './Button';
import Input from './Input';

type InputProps = {
  type: string;
  text: string;
  placeholder: string;
};

type FormProps = {
  title: string;
  InputData: InputProps[];
  InputInitialData: InputsInitial;
};

function Form({ title, InputData, InputInitialData }: FormProps) {
  const [inputs, setInputs] = useState(InputInitialData);
  const navigate = useNavigate();

  //인풋 저장
  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  //인풋 공백 체크
  const validateInput = (value: string, name: string) => {
    if (value === '') {
      alert(name + '입력해주세요');
      return false;
    }
    return true;
  };

  //회원가입 경우
  const signUpCase = () => {
    const { name, email, password } = inputs;
    if (
      !validateInput(name, '이름을') ||
      !validateInput(email, '이메일을') ||
      !validateInput(password, '비밀번호를')
    )
      return;

    //오류는 firebaseapi.ts 에서 출력
    signUpFirebase(name, email, password).then((res) => {
      alert(`회원가입이 완료되었습니다. ${res}님
      로그인 페이지로 이동합니다.`);
      navigate('/login');
    });
  };

  //로그인의 경우
  const loginCase = () => {
    const { email, password } = inputs;
    if (
      !validateInput(email, '이메일을') ||
      !validateInput(password, '비밀번호를')
    )
      return;

    loginFirebase(email, password).then((res) => {
      alert(`환영합니다. ${res.displayName}님`);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === 'SignUp') {
      signUpCase();
    }
    if (title === 'Login') {
      loginCase();
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <InputsContainer>
        {InputData.map(({ type, text, placeholder }, idx) => (
          <Input
            key={idx}
            type={type}
            text={text}
            placeholder={placeholder}
            value={inputs[`${text}`]}
            active={inputs[`${text}`]?.length > 0}
            handleInputs={handleInputs}
          />
        ))}
      </InputsContainer>
      <ButtonContainer>
        <Button text={title} type='submit' bgColor='blue' round />
        {title === 'SignUp' && (
          <Button text='Cancel' round handleOnclick={() => navigate(-1)} />
        )}
        {title === 'Login' && (
          <Link to='/signup'>
            <p>회원가입을 안하셨나요?</p>
          </Link>
        )}
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 10px;
`;

Form.defaultProps = {};

export default Form;
