"use client";
import React, { useContext } from "react";
import StyledTreeItem from "../StyledTreeItem";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { TreeItemProps } from "@mui/lab";
import NodeFormModal from "./FolderNodeFormModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import NodeService from "@/features/treeview/services/node.service";
import DeleteFolderModal from "./FolderDeleteModal";
import MoveToFolderModal from "./FolderMoveToModal";
import AddNewItemModal from "../data-tree-item/AddNewItemModal";
import DataNodeTreeItem from "../data-tree-item/DataNodeTreeItem";
import FolderNode from "../../models/folderNode";
import { EnumNodeType } from "../../models/contentNode";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useRouter } from "next/navigation";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import ChatService from "@/features/chat/services/chatterbox.service";

type FolderNodeTreeItemProps = {
  node: FolderNode;
  parentRefetch: () => void;
};

export default function FolderNodeTreeItem(props: FolderNodeTreeItemProps) {
  const router = useRouter();

  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [openEditContentNode, setOpenEditContentNode] = React.useState(false);
  const [editableNode, setEditableNode] = React.useState(new FolderNode("0"));

  const [openDeleteFolder, setOpenDeleteFolder] = React.useState(false);
  const [openMoveFolder, setOpenMoveFolder] = React.useState(false);

  const [openAddItem, setOpenAddItem] = React.useState(false);

  const [editingName, setEditingName] = React.useState(false);
  const { node, parentRefetch, ...other } = props;

  const {
    data: childsData,
    isLoading: isLoadingchildsData,
    isError: errorchildsData,
    refetch,
  } = useQuery({
    queryKey: ["RootNodesUserId", node.id],
    queryFn: async () => {
      if (node.id) return await NodeService.getChilds(node.id);
    },
    refetchOnWindowFocus: false,
  });

  const mutationDelete = useMutation({
    mutationFn: async () => {
      setOpenDeleteFolder(false);
      if (node.id) await NodeService.delete(node.id);
      parentRefetch();
      return true;
    },
  });

  const mutationProcessData = useMutation({
    mutationFn: async () => {
      if (node.id) await ChatService.processData(node.id);

      return true;
    },
  });

  const toggleOpen = () => {
    setOpen(!open);
  };

  const openChat = () => {
    router.push("./home/chat/" + node.id);
  };

  return (
    <>
      <StyledTreeItem
        parentrefetch={() => {
          parentRefetch();
        }}
        nodeId={node.id || ""}
        labelText={node.name}
        emojiUnified={node.emojiUnified ? node.emojiUnified : ""}
        clickHandler={toggleOpen}
        editing={editingName}
        actionbuttons={[
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
            labelIcon: CreateNewFolderIcon,
            labelText: "Add Folder",
            onClick: () => {
              setEditableNode(new FolderNode(node.id || ""));
              setOpenEditContentNode(true);
            },
          },
          {
            labelIcon: InsertDriveFileIcon,
            labelText: "Add Element",
            onClick: () => {
              setOpenAddItem(true);
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
        onEmojiClick={function (event: any): void {}}
      >
        {!isLoadingchildsData &&
        childsData.data &&
        childsData.data.childrens ? (
          childsData.data.childrens.map((nodeChild: any, i: any) => {
            nodeChild.parentId = node.id;
            if (nodeChild.type === EnumNodeType.FOLDER) {
              return (
                <FolderNodeTreeItem
                  parentRefetch={() => {
                    refetch();
                  }}
                  key={i}
                  node={nodeChild}
                />
              );
            } else {
              return (
                <DataNodeTreeItem
                  parentRefetch={() => {
                    refetch();
                  }}
                  key={i}
                  node={nodeChild}
                />
              );
            }
          })
        ) : (
          <></>
        )}
      </StyledTreeItem>

      <MoveToFolderModal
        open={openMoveFolder}
        node={undefined}
        onClose={function (): void {
          setOpenMoveFolder(false);
        }}
        onSave={function (): void {
          //throw new Error("Function not implemented.");
        }}
      />

      <DeleteFolderModal
        open={openDeleteFolder}
        name={node.name}
        onCancel={() => {
          setOpenDeleteFolder(false);
        }}
        onYes={() => {
          mutationDelete.mutate();
        }}
      />

      <NodeFormModal
        key={1}
        open={openEditContentNode}
        onClose={() => {
          setOpenEditContentNode(false);
        }}
        onSave={() => {
          refetch();
          parentRefetch();
          setOpenEditContentNode(false);
        }}
        node={editableNode}
      />

      <AddNewItemModal
        open={openAddItem}
        parentId={node.id || ""}
        onClose={() => {
          setOpenAddItem(false);
          parentRefetch();
        }}
        onAddFile={() => {
          console.log("onAddFile");
          refetch();
        }}
      />
    </>
  );
}
