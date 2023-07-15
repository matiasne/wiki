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
  chatterboxId: string;
}

const ChatInterface = ({ chatterboxId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<any>([]);
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [conversationId, setConversationId] = useState<any>("");

  const mutationSendMessage = useMutation({
    mutationFn: async (message) => {
      chatService
        .sendMessage(chatterboxId, message, chatHistory, conversationId)
        .then((res: any) => {
          let response = res.data;

          if (response.conversationId)
            setConversationId(response.conversationId);

          setChatHistory([...chatHistory, message, response.text]);
          let msg = "<p> " + response.text + " </p> ";

          if (response.sourceDocuments && response.sourceDocuments.length > 0) {
            msg += "<p> Sources: " + response.sourceDocuments.length + " </p> ";

            response.sourceDocuments.forEach((doc: any) => {
              if (doc.metadata.source) {
                if (doc.metadata.source.includes("http")) {
                  msg +=
                    " <a target='_blank' href='" +
                    doc.metadata.source +
                    "'> " +
                    doc.metadata.source +
                    " </a> <br>";
                }

                if (doc.metadata.source.includes("./uploads")) {
                  const link = doc.metadata.source.replace(
                    "./uploads",
                    "http://localhost:3001"
                  );
                  msg +=
                    " <a target='_blank'  href='" +
                    link +
                    "'> " +
                    link +
                    " </a> <br>";
                }
              }

              console.log(doc.metadata.userName);
              if (doc.metadata.userName) {
                msg +=
                  " <a target='_blank'  href='" +
                  doc.metadata.userName +
                  "'> " +
                  doc.metadata.userName +
                  " </a> <br>";
              }
            });
          }

          const messageModel = {
            type: "html",
            direction: "incoming",
            message: msg,
          };
          setMessages([...messages, messageModel]);
        });

      return true;
    },
  });

  const sendMessage = (message: any) => {
    console.log(chatterboxId, message);
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
