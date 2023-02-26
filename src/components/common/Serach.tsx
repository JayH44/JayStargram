import React, { useState } from 'react';
import styled from 'styled-components';
import Input from './Input';
import { BsSearch } from 'react-icons/bs';
import SerachResults from './SerachResults';
type SerachProps = {};

function Serach() {
  const [input, setInput] = useState('');
  const [focusOn, setFocusOn] = useState(false);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <Container
      onFocus={() => setFocusOn(true)}
      onBlur={() => setTimeout(() => setFocusOn(false), 200)}>
      <Input
        type='text'
        text='검색'
        value={input}
        active={input.length > 0}
        handleInputs={handleInput}
        placeholder={
          <>
            <BsSearch /> <p>검색</p>
          </>
        }
      />
      {focusOn && <SerachResults input={input} />}
    </Container>
  );
}
const Container = styled.div``;

Serach.defaultProps = {};

export default Serach;
