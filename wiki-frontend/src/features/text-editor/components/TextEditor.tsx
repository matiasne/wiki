"use client";

import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

Quill.register("modules/cursors", QuillCursors);

const CURSOR_LATENCY = 1000;

const TEXT_LATENCY = 500;
const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

let arrayColors = ["red", "blue", "green", "yellow", "orange", "purple"];

interface ICursorData {
  range: any;
  userName: string;
}

type Message = {
  author: string;
  message: string;
};

type TextEditorProps = {
  id: string;
  username: string;
};

export interface GetDocumentParametersDTO {
  nodeId: string;
  userName: string;
}

export default function TextEditor({ id, username }: TextEditorProps) {
  const [quill, setQuill] = useState<Quill>();
  const [socket, setSocket] = useState<Socket>();
  const [cursorsModule, setCursorsModule] = useState<QuillCursors>();
  const [cursors, setCursors] = useState<ICursorData[]>([]);

  useEffect(() => {
    setSocket(io("http://localhost:3002"));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.on("conectado", () => {});

    socket.on("connect", () => {
      socket.on("load-document", (document) => {
        quill.setText(document);
        quill.enable();

        socket.emit("start-editing", params);
      });

      let params: GetDocumentParametersDTO = {
        nodeId: id,
        userName: username,
      };

      socket.emit("connect-to-document", params);
    });
  }, [socket, quill, id]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      if (quill.isEnabled()) socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (data: any) => {
      let i = cursors.findIndex((c) => c.userName == data.userName);
      if (i >= 0) cursors.splice(i, 1);
    };
    socket.on("user-disconnect", handler);

    return () => {
      socket.off("user-disconnect", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.on("receive-cursor-changes", handleUserCursorChange);
    return () => {
      socket.off("receive-cursor-changes", handleUserCursorChange);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any, oldDelta: any, source: any) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    quill.on("selection-change", sendCursorChange);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const sendCursorChange = (range: any, oldRange: any, source: any) => {
    if (source == "user") {
      let myCursorData: ICursorData = {
        range: range,
        userName: username,
      };
      if (socket) socket.emit("send-cursor-changes", myCursorData);
    }
  };

  const handleUserCursorChange = (data: ICursorData) => {
    if (data.userName == username) return;

    let cursor = cursors?.find((c) => c.userName == data.userName);
    if (cursor) {
      cursorsModule?.moveCursor(data.userName, data.range);
    } else {
      cursorsModule?.createCursor(
        data.userName,
        data.userName,
        arrayColors[cursors.length]
      );
      cursorsModule?.moveCursor(data.userName, data.range);
      cursors.push(data);

      setCursors(cursors);
    }
  };

  const wrapperRef = useCallback((wrapper: any) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: {
          transformOnTextChange: true,
        },
      },
    });

    q.disable();
    setQuill(q);
    setCursorsModule(q.getModule("cursors"));
  }, []);

  return (
    <>
      {id}
      <div className="container" ref={wrapperRef}></div>
    </>
  );
}
