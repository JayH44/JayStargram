import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  inputs: InputsInitial;
  setInputs: React.Dispatch<React.SetStateAction<InputsInitial>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

function Form({ title, InputData, inputs, setInputs, onSubmit }: FormProps) {
  const navigate = useNavigate();

  //인풋 저장
  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <Container onSubmit={onSubmit}>
      <h2>{title}</h2>
      <InputsContainer>
        {InputData.map(({ type, text, placeholder }, idx) => (
          <Input
            key={idx}
            type={type}
            name={text}
            customplaceholder={placeholder}
            value={inputs[`${text}`]}
            active={inputs[`${text}`]?.length > 0}
            onChange={handleInputs}
          />
        ))}
      </InputsContainer>
      <ButtonContainer>
        <Button text={title} type='submit' bgColor='blue' round />
        {title === 'SignUp' && (
          <Button text='Cancel' round onClick={() => navigate(-1)} />
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
