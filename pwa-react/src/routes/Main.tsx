import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Wrapper,
  FirstSection,
  SecondSection,
  ThirdSection,
} from "../styles/Main/Main";
import { UserInterface, CoupleInterface } from "../interface/UserInterface";

import { BurgerButton } from "../styles/common/hamburger";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/Main/HeaderSection";
import { Card } from "../styles/common/card";
import CalendarCard from "../components/Main/CalendarCard";
import QuestionCard from "../components/Main/QuestionCard";
import useAuthStore from "../stores/AuthStore";
import useUserStore from "../stores/UserStore";
import { useShallow } from "zustand/react/shallow";
import useCoupleStore from "../stores/CoupleStore";
import { axiosAuth } from "../util/token";
import TokenCheker from "../util/TokenCheker";
import axios from "axios";

const Main = () => {
  const { id } = useParams();
  const { setCouple, setYourName } = useCoupleStore(
    useShallow((state) => ({
      setCouple: state.setCouple,
      setYourName: state.setYourName,
    }))
  );
  const { setUser } = useUserStore();
  const userId = useUserStore.getState().userId;
  const coupleId = useUserStore.getState().coupleId;
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [cp1, setCp1] = useState<UserInterface>();
  const [cp2, setCp2] = useState<UserInterface>();
  const [cpInfo, setCpInfo] = useState<CoupleInterface>();
  const token = useAuthStore.getState().token;
  const toggleNavigation = () => {
    setIsNavigationOpen(!isNavigationOpen);
  };

  // 채팅방 이동 시 roomId 조회
  const goChat = async () => {
    const res = await axiosAuth.get("/chat/enter", {
      params: { coupleId: coupleId },
    });
    console.log(res);
    navigate(`/chat/${res.data}`);
  };

  // 메인화면 접속 시 커플 정보 조회
  const callData = async () => {
    const res = await axiosAuth.get("/couple/main", {
      params: { coupleId: coupleId },
    });

    setCouple({
      coupleId: res.data[2].coupleId,
      name: res.data[2].name,
      startDate: res.data[2].startDate,
      fuserId: res.data[2].fuserId,
      suserId: res.data[2].suserId,
    });

    if (res.data[0].userId === userId) {
      setYourName(res.data[1].userId, res.data[1].name, res.data[1].nickname);
      setUser(res.data[0]);
    } else {
      setYourName(res.data[0].userId, res.data[0].name, res.data[0].nickname);
      setUser(res.data[1]);
    }

    setCp1(res.data[0]);
    setCp2(res.data[1]);
    setCpInfo(res.data[2]);
  };

  const checkChat = async () => {
    const res = await axiosAuth.get("/chat/unread/message", {
      params: {
        userId: userId,
      },
    });
    console.log(res);
  };

  useEffect(() => {
    callData();
    checkChat();
  }, []);

  const navigate = useNavigate();

  const goDiary = () => {
    navigate("/diary");
  };

  return (
    <>
      <TokenCheker />
      <BurgerButton onClick={toggleNavigation}>
        {isNavigationOpen ? "×" : "☰"}
      </BurgerButton>

      <Navbar isOpen={isNavigationOpen} />
      <HeaderSection cp1={cp1} cp2={cp2} cpInfo={cpInfo} />
      <Wrapper>
        <FirstSection>
          <Card
            className="camera"
            onClick={() => {
              navigate("/camera");
            }}
          >
            <div>
              <p>사진</p>
              <p>찍으러 가기</p>
            </div>
          </Card>
          <Card className="diary" onClick={goDiary}>
            <p>다이어리</p>
          </Card>
          <Card className="chat" onClick={goChat}>
            <p className="chat_name">채팅</p>
            <p className="chat_num">N</p>
          </Card>
        </FirstSection>

        <SecondSection>
          <CalendarCard />
          <QuestionCard />
        </SecondSection>

        <ThirdSection>
          <Card className="balance_game">
            <p>밸런스게임</p>
            <p>VS</p>
          </Card>
          <Card className="challenge">
            <div>
              <p>매일</p>
              <p>챌린지</p>
            </div>
          </Card>
        </ThirdSection>
      </Wrapper>
    </>
  );
};

export default Main;
