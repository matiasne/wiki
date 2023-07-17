import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import chatService from "./services/chatterbox.service";

interface ChatInterfaceProps {
  chatterboxId: string;
  nodeId?: string;
}

interface IMessageUI {
  type: string;
  direction: string;
  text: string;
  sourceDocuments: any[];
}

const ChatInterface = ({ chatterboxId, nodeId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    mutationGetConversation.mutate();
  }, [chatterboxId, nodeId]);

  const mutationGetConversation = useMutation({
    mutationFn: async () => {
      chatService
        .getConversation(nodeId ? nodeId : chatterboxId, 1)
        .then(async (res: any) => {
          let response = res.data;

          let messages: any[] = [];
          for await (let element of response) {
            console.log(element);
            addMessageUI({
              type: "text",
              direction: element.userMessage ? "outgoing" : "incoming",
              text: element.data,
              sourceDocuments: element.sourceDocuments
                ? element.sourceDocuments
                : [],
            });

            const messageModel = {
              direction: element.userMessage ? "outgoing" : "incoming",
              position: "single",
              message: element.data,
              sender: "User",
            };

            messages.push(messageModel);
          }
          setMessages([...messages, messages]);
        });

      return true;
    },
  });

  const mutationSendMessage = useMutation({
    mutationFn: async (message) => {
      chatService
        .sendMessage(chatterboxId, nodeId ? nodeId : "", message)
        .then((res: any) => {
          let response = res.data;

          addMessageUI({
            type: "text",
            direction: "incoming",
            text: response.text,
            sourceDocuments: response.sourceDocuments,
          });
        });

      return true;
    },
  });

  const addMessageUI = (message: IMessageUI) => {
    let msg = "<p> " + message.text + " </p> ";

    if (message.sourceDocuments && message.sourceDocuments.length > 0) {
      msg += "<p> Sources: " + message.sourceDocuments.length + " </p> ";

      message.sourceDocuments.forEach((doc: any) => {
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
      direction: message.direction,
      position: "single",
      message: msg,
    };
    console.log(messageModel);
    setMessages([...messages, messageModel]);
  };

  const sendMessage = (message: any) => {
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
