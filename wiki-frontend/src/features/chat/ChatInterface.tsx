import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import chatService from "./services/chatterbox.service";

interface ChatInterfaceProps {
  nodeId: string;
}

const ChatInterface = ({ nodeId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<any>([]);

  const mutationSendMessage = useMutation({
    mutationFn: async (message) => {
      chatService.sendMessage(nodeId, message).then((res: any) => {
        console.log(res);
        const messageModel = {
          direction: "incoming",
          position: "single",
          message: res.data.data.text,
          sender: "User",
        };
        setMessages([...messages, messageModel]);
      });

      return true;
    },
  });

  const sendMessage = (message: any) => {
    console.log(nodeId, message);
    mutationSendMessage.mutate(message);
    const messageModel = {
      direction: "outgoing",
      position: "single",
      message: message,
      sender: "User",
    };
    setMessages([...messages, messageModel]);
  };

  return (
    <div style={{ height: "80%", width: "100%" }}>
      <MainContainer>
        <ChatContainer style={{ height: "90vh" }}>
          <MessageList>
            {messages.map((message: any, i: number) => {
              return (
                <Message
                  key={i}
                  model={{
                    direction: message.direction,
                    position: message.position,
                    message: message.message,
                    sender: message.sender,
                  }}
                />
              );
            })}
          </MessageList>
          <MessageInput
            style={{
              position: "absolute",
              bottom: "0px",
              width: "100%",
            }}
            placeholder="Type message here"
            onSend={(message) => {
              sendMessage(message);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatInterface;
