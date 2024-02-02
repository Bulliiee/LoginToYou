import React, { LegacyRef, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { axiosAuth } from "../util/token";

import useUserStore from "../stores/UserStore";
import useAuthStore from "../stores/AuthStore";
import { useShallow } from "zustand/react/shallow";

import { Header, InputForm } from "../styles/Chat/UI";
import { IconContext } from "react-icons";
import { GoArrowLeft } from "react-icons/go";
import { FaPhone } from "react-icons/fa";
import MessageBox from "../components/Chat/MessageBox";
import InputBox from "../components/Chat/InputBox";
import { MessageInterface } from "../interface/MessageInterface";
import TokenCheker from "../util/TokenCheker";

function Chat() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [showMessages, setShowMessages] = useState<MessageInterface[]>([]);
  const [message, setMessage] = useState("");
  const client = useRef<CompatClient>();
  const PATH = useAuthStore.getState().PATH;
  const token = useAuthStore.getState().token;

  const { coupleId, userId, name } = useUserStore(
    useShallow((state) => ({
      userId: state.userId,
      coupleId: state.coupleId,
      name: state.name,
    }))
  );
  const navigate = useNavigate();
  const { room_id } = useParams();
  const [showChatNum, setShowChatNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOppOn, setIsOppOn] = useState(false);

  const updateReadCount = () => {
    setShowMessages((messages) => {
      return messages.map((each) => ({ ...each, readCount: false }));
    });
  };

  const updateRead = async () => {
    await axiosAuth.post(
      "/chat/readUser",
      {},
      {
        params: {
          roomId: room_id,
          userId: userId,
        },
      }
    );
  };

  const checkRoom = async () => {
    const res = await axiosAuth.get("/chat/connect/check", {
      params: {
        roomId: room_id,
      },
    });
    console.log(res);
    if (res.data == 1) {
      setIsOppOn(true);
    }
  };

  // 소켓 연결 함수
  const connectHandler = () => {
    client.current = Stomp.over(() => {
      const sock = new SockJS(`${PATH}/ws-stomp`, null);
      return sock;
    });

    client.current.connect(
      {
        Authorization: token,
      },
      () => {
        if (!client.current) return;
        if (!token) return;
        updateRead();

        // // 더미데이터 만드는 코드
        // for (let i = 1; i <= 150; i++) {
        //   client.current.send(
        //     `/pub/chat/message`,
        //     {
        //       Authorization: token,
        //     },
        //     JSON.stringify({
        //       type: "TALK",
        //       roomId: room_id,
        //       sendUserId: i % 2 == 0 ? 1 : 2,
        //       message: i,
        //       createdAt: new Date().toLocaleString(),
        //       readCount: isOppOn ? false : true,
        //     })
        //   );
        // }

        // 신규 메세지 체크
        client.current.subscribe(
          `/sub/chat/room/${room_id}`,
          (msg) => {
            if (!msg.body) return;
            let newMsg = JSON.parse(msg.body);
            console.log(newMsg.type);
            if (newMsg.type == "SUBSCRIBE") {
              setIsOppOn((prev) => true);
            } else if (newMsg.type == "TALK") {
              if (newMsg.sendUserId != userId) {
                newMsg.readCount = false;
              }

              setShowMessages((showMessages) => {
                return showMessages ? [...showMessages, newMsg] : [newMsg];
              });

              updateRead();
            } else if (newMsg.type == "DISCONNECT") {
              setIsOppOn(false);
            }
          },
          {
            Authorization: token,
          }
        );
      }
    );
  };

  useEffect(() => {
    if (isOppOn == true) {
      setMessages((prev) => {
        return prev.map((each) => ({ ...each, readCount: false }));
      });
      setShowMessages((prev) => {
        return showMessages.map((each) => ({ ...each, readCount: false }));
      });
    }
  }, [isOppOn]);

  // 정보 받아오기
  useEffect(() => {
    connectHandler();
  }, [room_id]);

  // 초기 실행 시 채팅 불러오기(1)
  const loadChat = async () => {
    const res = await axiosAuth("chat/load", {
      params: {
        roomId: room_id,
      },
    });

    // 원본 배열 저장
    setMessages((prev) => {
      let messages: MessageInterface[];
      messages = res.data;
      return messages.map((each) =>
        each.sendUserId == userId ? each : { ...each, readCount: false }
      );
    });

    // 미로드된 메세지 갯수 지정 (초기 최대 50개까지 보임)
    setShowChatNum((num) =>
      res.data.length - 50 >= 0 ? res.data.length - 50 : 0
    );

    // 보일 메세지 배열 세팅
    setShowMessages((prev) => {
      let messages: MessageInterface[];
      messages = res.data;
      return messages
        .map((each) => {
          return each.sendUserId == userId
            ? each
            : { ...each, readCount: false };
        })
        .slice(res.data.length - 50, res.data.length);
    });
  };

  // 위로 스크롤 시 추가 로딩 함수
  const addScroll = () => {
    if (document.documentElement.scrollTop < 100) {
      if (isLoading) return;
      if (!messages || messages.length < 50) return;
      if (!showMessages || showMessages.length < 50) return;
      if (!isLoading) setIsLoading(true);
    }
  };

  useEffect(() => {
    if (!isLoading) return;

    let prevHeight = document.documentElement.scrollHeight;
    console.log("대화 내용을 불러옵니다:남은 대화 갯수", showChatNum);

    if (showChatNum > 0) {
      setShowMessages((message) => {
        return message
          ? [
              ...messages.slice(
                showChatNum - 50 > 0 ? showChatNum - 50 : 0,
                showChatNum
              ),
              ...message,
            ]
          : [];
      });

      setTimeout(() => {
        document.documentElement.scrollTop =
          document.documentElement.scrollHeight - prevHeight;
      }, 1);

      setShowChatNum((num) => {
        return num - 50 >= 0 ? num - 50 : 0;
      });
    }
    setIsLoading(false);
  }, [isLoading]);

  // 초기 실행 시 채팅 불러오기
  useEffect(() => {
    loadChat();
    checkRoom();

    return () => {
      client.current?.disconnect();
    };
  }, []);

  // infinite loading을 위한 event 추가
  useEffect(() => {
    if (showChatNum <= 0) return;
    window.addEventListener("scroll", addScroll);
    return () => window.removeEventListener("scroll", addScroll);
  }, [messages, showChatNum, isLoading]);

  return (
    <div>
      <TokenCheker />
      <Header>
        <IconContext.Provider value={{ size: "20px" }}>
          <GoArrowLeft
            onClick={() => {
              navigate("/");
            }}
          />
          <FaPhone
            onClick={() => {
              navigate("/chat/video");
            }}
          />
        </IconContext.Provider>
      </Header>
      <MessageBox messages={showMessages} userId={userId}></MessageBox>
      <InputBox
        client={client}
        message={message}
        setMessage={setMessage}
        userId={userId}
        roomId={room_id}
        isOppOn={isOppOn}
      ></InputBox>
    </div>
  );
}

export default Chat;
