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

type Message = {
  author: string;
  message: string;
};

type TextEditorProps = {
  id: string;
};

export default function TextEditor({ id }: TextEditorProps) {
  //const documentId = "test";

  console.log(id);
  const [quill, setQuill] = useState<Quill>();
  const [socket, setSocket] = useState<Socket>();
  const [cursorsModule, setCursorsModule] = useState<QuillCursors>();
  let cursorsPage: any;

  useEffect(() => {
    setSocket(io("http://localhost:3002"));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", id);
  }, [socket, quill, id]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta: any) => {
      console.log(delta);
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
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
    if (source == "user") if (socket) socket.emit("send-cursor-changes", range);
  };

  const handleUserCursorChange = (data: any) => {
    if (cursorsModule) cursorsModule.moveCursor("cursorRemote", data);
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
    q.setText("Loading...");
    setQuill(q);

    let cursorsModule = q.getModule("cursors");
    cursorsModule.createCursor("cursorRemote", "User 2", "blue");

    setCursorsModule(cursorsModule);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}
