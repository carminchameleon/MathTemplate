import React from "react";
import styled from "styled-components";

function Default() {
  return (
    <Container>
      <MessageBox>
        <Button>유사문항</Button>
        <Message>
          버튼을 누르면 <br></br>
          해당 문제의 유사 문항을 볼 수 있습니다.
        </Message>
      </MessageBox>
    </Container>
  );
}

export default Default;

const Container = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
`;

const Button = styled.span`
  padding: 4px 12px 4px 12px;

  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 3px;
  margin-right: 3px;
  font-size: 10px;
  color: #00abff;
  :focus {
    outline: none;
  }
`;

const MessageBox = styled.span`
  text-align: center;
  color: #9f9f9f;
  font-size: 14px;
  line-height: 28px;
`;

const Message = styled.span``;
