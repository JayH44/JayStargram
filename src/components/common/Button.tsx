import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  bgColor?: string;
  color?: string;
  width?: string;
  height?: string;
  round?: boolean;
}

type ButtonConatinerProps = Omit<ButtonProps, 'text'>;

function Button({
  text,
  bgColor,
  color,
  width,
  height,
  round,
  ...props
}: ButtonProps) {
  return (
    <Container
      {...props}
      bgColor={bgColor}
      width={width}
      height={height}
      round={round}>
      {text}
    </Container>
  );
}

const Container = styled.button<ButtonConatinerProps>`
  background-color: ${({ theme, bgColor }) => bgColor || theme.buttonColor};
  color: ${({ theme, color }) => color || 'white'};
  width: ${({ theme, width }) => width || theme.comWidth};
  height: ${({ theme, height }) => height || theme.comHeight};
  font-weight: 600;
  border-radius: ${({ round }) => (round ? '5px' : 0)};

  white-space: nowrap;
  text-overflow: ellipsis;
`;

Button.defaultProps = {
  text: '',
  type: 'button',
  round: false,
};

export default Button;
