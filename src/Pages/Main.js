import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Default from "./Default";

function Main() {
  const [questionData, setQuestionData] = useState([]);
  const [similarData, setSimilarData] = useState([]);
  const [showSim, setShowSim] = useState(false);
  const [unitName, setUnitName] = useState();
  const [currentQueNum, setCurrentQueNum] = useState();
  const [currentDelNum, setCurrentDelNum] = useState();
  const [currentSimNum, setCurrentSimNum] = useState();

  //문제를 불러오는 함수
  const fetchQuestion = async () => {
    try {
      const gotQuestion = await axios.get(
        "http://localhost:3000/data/question.json"
      );
      const data = await gotQuestion.data;
      // setInitQuesData(data.data);
      setQuestionData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 유사문항을 불러오는 함수
  const fetchSimilar = async () => {
    try {
      const gotQuestion = await axios.get(
        "http://localhost:3000/data/similar.json"
      );
      const data = await gotQuestion.data;
      setSimilarData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchSimilar();
  }, []);

  // 유사 문항을 불러오는 함수
  const handleSimilar = (num, name) => {
    setShowSim(true); // 오른쪽에 유사 문제를 불러옴
    setCurrentQueNum(num); // 현재 선택한 문제의 index를 저장
    setUnitName(name);
  };

  // 삭제하는 함수
  const deleteQuestion = (num) => {
    questionData.splice(num, 1); // 선택된 문제를 기존 문제리스트에서 삭제함
    setShowSim(false); // 유사 문제를 안보이게 바꿈
    setCurrentDelNum(num); // 선택한 삭제 번호
    setCurrentQueNum();
    setUnitName();
  };

  // 유사 문항 추가
  const pushSimQues = (data, num) => {
    setCurrentSimNum(num); // 현재 선택된 넘버
    questionData.splice(currentQueNum + 1, 0, data); //선택한 데이터를 내가 active한 문제의 아래에 넣어줌
    setQuestionData(questionData);
    similarData.splice(num - 1, 1); // 유사 문항 리스트에서 삭제
    setSimilarData(similarData);
  };

  // 유사 문항 교체
  const changeQues = (data, num) => {
    // 기존에 있었던 리스트의 num에 해당하는 부분 지우기
    // 그 quenumber 부분에 오른쪽의 문제 데이터 넣기\
    // 기존에 있었던 문제를 오른쪽 리스트에 넣기
    let SelecteddefualtData = questionData.splice(currentQueNum, 1, data); // 오른쪽으로 보낼 데이터
    similarData.splice(num, 1, SelecteddefualtData[0]);
    setQuestionData(questionData);
    setSimilarData(similarData);
    setCurrentSimNum(20);
  };

  useEffect(() => {
    setCurrentDelNum();
    setCurrentSimNum();
  }, [currentDelNum, currentQueNum, currentSimNum]);

  return (
    <Container>
      <Wrapper>
        <DefaultContainer>
          <DefaultQuestionTitle>
            <MainTitle>학습지 상세 편집</MainTitle>
          </DefaultQuestionTitle>
          <DefaultQuestionWrapper>
            {questionData.map((item, index) => {
              return (
                <QuestionContainer key={index}>
                  <InfoContainer>
                    <InfoBox>
                      <TypeNameBox>
                        <TypeName>{item.problemType}</TypeName>
                      </TypeNameBox>
                      <UnitNameBox>
                        <UnitName>{item.unitName}</UnitName>
                      </UnitNameBox>
                    </InfoBox>
                    <ButtonBox>
                      <ButtonWrapper>
                        <SimilarButton
                          style={
                            index === currentQueNum
                              ? { backgroundColor: "#00ABFF", color: "white" }
                              : { backgroundColor: "white" }
                          }
                          onClick={() => {
                            handleSimilar(index, item.unitName);
                          }}
                        >
                          유사문항
                        </SimilarButton>
                        <DeleteButton
                          onClick={() => {
                            deleteQuestion(index);
                          }}
                        >
                          삭제
                        </DeleteButton>
                      </ButtonWrapper>
                    </ButtonBox>
                  </InfoContainer>
                  <QuestionBox>
                    <NumberBox>
                      <Number>{index + 1}</Number>
                    </NumberBox>
                    <QuestionWrapper>
                      <QuestionImg
                        src={item.problemURL}
                        alt="questionImg"
                      ></QuestionImg>
                    </QuestionWrapper>
                  </QuestionBox>
                </QuestionContainer>
              );
            })}
          </DefaultQuestionWrapper>
        </DefaultContainer>

        <SimilarContainer>
          <SimilarQuestionTitle>
            <MainTitle>문항 교체/추가</MainTitle>
          </SimilarQuestionTitle>
          {showSim ? (
            <SimilarWrapper>
              <CurrentUnitNameBox>
                <CurrentUnitName>{unitName}</CurrentUnitName>
              </CurrentUnitNameBox>
              {similarData.map((item, index) => {
                return (
                  <QuestionContainer key={index}>
                    <InfoContainer>
                      <InfoBox>
                        <TypeNameBox>
                          <TypeName>{item.problemType}</TypeName>
                        </TypeNameBox>
                        <UnitNameBox>
                          <UnitName>{item.unitName}</UnitName>
                        </UnitNameBox>
                      </InfoBox>
                      <ButtonBox>
                        <ButtonWrapper>
                          <SimilarButton
                            onClick={() => {
                              pushSimQues(item, index + 1);
                            }}
                          >
                            추가
                          </SimilarButton>
                          <DeleteButton
                            onClick={() => {
                              changeQues(item, index);
                            }}
                          >
                            교체
                          </DeleteButton>
                        </ButtonWrapper>
                      </ButtonBox>
                    </InfoContainer>
                    <QuestionBox>
                      <NumberBox>
                        <Number>{index + 1}</Number>
                      </NumberBox>
                      <QuestionWrapper>
                        <QuestionImg
                          src={item.problemURL}
                          alt="questionImg"
                        ></QuestionImg>
                      </QuestionWrapper>
                    </QuestionBox>
                  </QuestionContainer>
                );
              })}
            </SimilarWrapper>
          ) : (
            <Default></Default>
          )}
        </SimilarContainer>
      </Wrapper>
    </Container>
  );
}

export default Main;

const Container = styled.div`
  font-family: "Noto Sans", sans-serif;
  width: 100%;
  font-family: Noto Sans KR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: #4c4c4c;
  background-color: #f2f2f2;
  height: 100vh;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 30px;
`;

const DefaultContainer = styled.div`
  width: 50%;
  background-color: white;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 10px;
  box-shadow: 4px 0px 0px 0px #e0e0e0;
`;

const SimilarContainer = styled.div`
  margin-top: 30px;
  width: 50%;
  height: 95vh;
  background-color: white;
  margin-bottom: 30px;
`;

const DefaultQuestionTitle = styled.div`
  height: 40px;
  line-height: 20px;
  color: #4c4c4c;
  border-bottom: 3px solid #f2f2f2;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SimilarQuestionTitle = styled.div`
  text-align: center;
  border-bottom: 3px solid #f2f2f2;
  line-height: 40px;
  font-weight: bold;
`;

const MainTitle = styled.div`
  margin-left: 20px;
`;
const DefaultQuestionWrapper = styled.div`
  width: 100%;
  height: 90vh;
  overflow: hidden;
  overflow-y: scroll;
  @media only screen and (max-width: 800px) {
    overflow-x: scroll;
  }
`;

const QuestionContainer = styled.div`
  width: 100%;
`;
const InfoContainer = styled.div`
  border: 1px solid #f5f5f5;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
    padding: 10px;
  }
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  @media only screen and (max-width: 1024px) {
    width: 100%;
    padding: 10px;
  }
`;
const TypeNameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 40px;

  @media only screen and (max-width: 1024px) {
    padding-left: 10px;
  }
`;

const UnitNameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TypeName = styled.div`
  color: #9f9f9f;
  font-weight: bold;
`;

const UnitName = styled.div`
  margin-left: 13px;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 14px;
  @media only screen and (max-width: 1024px) {
  }
`;

const ButtonWrapper = styled.div`
  @media only screen and (max-width: 1024px) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const SimilarButton = styled.button`
  width: 80px;
  height: 36px;
  margin-right: 4px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 3px;
  color: #00abff;
  :focus {
    outline: none;
  }
`;

const DeleteButton = styled.button`
  width: 80px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 3px;
  color: #00abff;
  :focus {
    outline: none;
  }
`;

const QuestionBox = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 5px solid #f2f2f2;
`;
const NumberBox = styled.div`
  margin-top: 10px;
  margin-left: 50px;
  margin-right: 14px;
`;

const Number = styled.div`
  font-size: 24px;
  text-align: center;
  line-height: 35px;
  color: #02c7f2;
`;

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionImg = styled.img`
  margin: 13px;
`;

const SimilarWrapper = styled.div`
  width: 100%;
  height: 90vh;
  overflow: hidden;
  overflow-y: scroll;
  @media only screen and (max-width: 800px) {
    overflow-x: scroll;
  }
`;

const CurrentUnitNameBox = styled.div`
  height: 30px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CurrentUnitName = styled.div`
  margin-left: 18px;
`;
