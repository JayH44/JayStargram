import React from 'react';
import styled, { css } from 'styled-components';

type InputProps = {
  type: string;
  text: string;
  active: boolean;
  placeholder: string | React.ReactNode;
  width?: string;
  height?: string;
  value?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  handleInputs?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type InputBoxProps = Pick<InputProps, 'width' | 'height'>;

function Input({
  type,
  text,
  active,
  placeholder,
  handleInputs,
  inputRef,
  value,
  width,
  height,
}: InputProps) {
  return (
    <Wrapper width={width} height={height}>
      <Placeholder active={active}>{placeholder}</Placeholder>
      <input
        type={type}
        name={text}
        onChange={handleInputs}
        value={value}
        ref={inputRef}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<InputBoxProps>`
  position: relative;

  input {
    width: ${({ theme, width }) => width || theme.comWidth};
    height: ${({ theme, height }) => height || theme.comHeight};
    padding: 0 10px;
    outline-color: blue;
    background-color: transparent;
    font-size: 0.9rem;

    position: relative;
    z-index: 1;
  }
`;

const Placeholder = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;

  position: absolute;
  font-size: 0.9rem;
  top: 0.25rem;
  left: 1rem;
  z-index: 0;
  transform-origin: left top;
  transition: all 0.3s ease-in-out;

  user-select: none;

  ${({ active }) =>
    active &&
    css`
      transform: scale(0.7);
      top: -0.4rem;
      color: blue;
      background-color: white;
      z-index: 2;
    `};
`;

Input.defaultProps = {
  placeholder: '입력해주세요',
  active: false,
};

export default Input;
