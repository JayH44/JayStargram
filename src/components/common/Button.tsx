import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
  text: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  bgColor?: string;
  color?: string;
  width?: string;
  height?: string;
};

type ButtonConatinerProps = Omit<ButtonProps, 'text'>;

function Button({ text, type, bgColor, color, width, height }: ButtonProps) {
  return (
    <Container
      type={type}
      bgColor={bgColor}
      color={color}
      width={width}
      height={height}
    >
      {text}
    </Container>
  );
}

const Container = styled.button<ButtonConatinerProps>`
  background-color: ${({ theme, bgColor }) => bgColor || theme.buttonColor};
  color: ${({ theme, color }) => color || theme.textColor};
  width: ${({ theme, width }) => width || theme.comWidth};
  height: ${({ theme, height }) => height || theme.comHeight};
  font-weight: 600;
`;

Button.defaultProps = {
  text: '',
  type: 'button',
};

export default Button;
