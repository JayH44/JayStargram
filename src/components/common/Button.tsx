import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
  text: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  bgColor?: string;
  color?: string;
  width?: string;
  height?: string;
  round?: boolean;
};

type ButtonConatinerProps = Omit<ButtonProps, 'text'>;

function Button({
  text,
  type,
  bgColor,
  color,
  width,
  height,
  round,
}: ButtonProps) {
  return (
    <Container
      type={type}
      bgColor={bgColor}
      color={color}
      width={width}
      height={height}
      round={round}
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
  border-radius: ${({ round }) => (round ? '5px' : 0)};
`;

Button.defaultProps = {
  text: '',
  type: 'button',
  round: false,
};

export default Button;
