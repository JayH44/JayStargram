import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
};

type InputsInitial = {
  [index: string]: string;
};

function Form({ title, InputData }: FormProps) {
  const [inputs, setInputs] = useState<InputsInitial>({});

  useEffect(() => {
    InputData.forEach((input) => {
      setInputs((inputs) => ({
        ...inputs,
        [input.text]: '',
      }));
    });
  }, [InputData]);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  return (
    <Container>
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
      <Button text={title} type='button'></Button>
    </Container>
  );
}

const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: ${({ theme }) => theme.pageHeight};

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

Form.defaultProps = {};

export default Form;
