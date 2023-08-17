"use client";
import React, { useContext } from "react";
import StyledTreeItem from "../StyledTreeItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { useMutation, useQuery } from "@tanstack/react-query";
import NodeService from "@/features/treeview/services/node.service";
import DataNodeFormModal from "./DataNodeFormModal";
import DataMoveToFolderModal from "./DataMoveToModal";
import DataDeleteModal from "./DataDeleteModal";
import DataNode from "../../models/dataNode";
import { BaseURL } from "@/config/variables";
import { EnumContentNodeType } from "../../models/enum.nodeType";
import { useRouter } from "next/navigation";

type DataNodeTreeItemProps = {
  node: DataNode;
  parentRefetch: () => void;
};

export default function DataNodeTreeItem(props: DataNodeTreeItemProps) {
  const router = useRouter();

  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [openEditContentNode, setOpenEditContentNode] = React.useState(false);
  const [editableNode, setEditableNode] = React.useState(new DataNode("0"));

  const [openDeleteFolder, setOpenDeleteFolder] = React.useState(false);
  const [openMoveFolder, setOpenMoveFolder] = React.useState(false);

  const [openAddItem, setOpenAddItem] = React.useState(false);

  const [editingName, setEditingName] = React.useState(false);
  const { node, parentRefetch, ...other } = props;

  const mutationDelete = useMutation({
    mutationFn: async () => {
      setOpenDeleteFolder(false);
      if (node.id) await NodeService.delete(node.id);
      parentRefetch();
      return true;
    },
  });

  const toggleOpen = () => {
    setOpen(!open);
  };

  const openChat = () => {
    router.push("./home/chat/" + node.parentId + "/" + node.id);
  };

  const openLink = () => {
    if (node.type === EnumContentNodeType.URL) window.open(node.data, "_blank");

    if (node.type === EnumContentNodeType.FILE)
      window.open(BaseURL + "/" + node.data, "_blank");
    //router.push("./home/pdf-view/" + node.data);
    if (node.type === EnumContentNodeType.RICH_TEXT)
      router.push("./home/text-editor/" + node.id);
  };

  return (
    <>
      <StyledTreeItem
        nodeId={node.id || ""}
        labelText={node.name}
        emojiUnified={node.emojiUnified ? node.emojiUnified : ""}
        clickHandler={toggleOpen}
        onEmojiClick={(e: any) => {
          openLink();
        }}
        actionbuttons={[
          {
            labelIcon: SearchIcon,
            labelText: "Chat",
            onClick: (event) => {
              event.stopPropagation();
              openChat();
            },
          },
          {
            labelIcon: OpenInNewIcon,
            labelText: "Open",
            onClick: (event) => {
              event.stopPropagation();
              openLink();
            },
          },
          {
            labelIcon: EditIcon,
            labelText: "Edit",
            onClick: (event) => {
              event.stopPropagation();
              setEditableNode(node);
              setOpenEditContentNode(true);
            },
          },
          {
            labelIcon: DriveFolderUploadIcon,
            labelText: "Move",
            onClick: (event) => {
              event.stopPropagation();
              setOpenMoveFolder(true);
            },
          },
          {
            labelIcon: DeleteOutlineIcon,
            labelText: "Delete",
            onClick: (event) => {
              event.stopPropagation();
              setOpenDeleteFolder(true);
            },
          },
        ]}
      ></StyledTreeItem>

      <DataMoveToFolderModal
        open={openMoveFolder}
        node={undefined}
        onClose={function (): void {
          setOpenMoveFolder(false);
        }}
        onSave={function (): void {
          //throw new Error("Function not implemented.");
        }}
      />

      <DataDeleteModal
        open={openDeleteFolder}
        name={node.name}
        onCancel={() => {
          setOpenDeleteFolder(false);
        }}
        onYes={() => {
          mutationDelete.mutate();
        }}
      />

      <DataNodeFormModal
        key={1}
        open={openEditContentNode}
        onClose={() => {
          setOpenEditContentNode(false);
        }}
        onSave={() => {
          parentRefetch();
          setOpenEditContentNode(false);
        }}
        node={editableNode}
      />
    </>
  );
}
