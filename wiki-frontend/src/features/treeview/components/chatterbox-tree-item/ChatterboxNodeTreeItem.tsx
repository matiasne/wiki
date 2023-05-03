"use client";
import React, { useContext } from "react";
import StyledTreeItem from "../StyledTreeItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import { useMutation, useQuery } from "@tanstack/react-query";
import NodeService from "@/features/treeview/services/node.service";
import DataNode from "../../models/dataNode";
import { BaseURL } from "@/config/variables";
import { EnumContentNodeType } from "../../models/enum.nodeType";
import { useRouter } from "next/navigation";
import ChatterboxNode from "../../models/chatterboxNode";
import ChatService from "@/features/chat/services/chatterbox.service";
import FolderNode from "../../models/folderNode";
import { EnumNodeType } from "../../models/contentNode";
import AddNewItemModal from "../data-tree-item/AddNewItemModal";
import DataNodeTreeItem from "../data-tree-item/DataNodeTreeItem";
import DeleteFolderModal from "../folder-tree-item/FolderDeleteModal";
import FolderNodeTreeItem from "../folder-tree-item/FolderNodeTreeItem";
import ChatterboxNodeFormModal from "./ChatterboxNodeFormModal";
import FolderNodeFormModal from "../folder-tree-item/FolderNodeFormModal";

type ChatterboxNodeTreeItemProps = {
  node: ChatterboxNode;
  parentRefetch: () => void;
};

export default function ChatterboxNodeTreeItem(
  props: ChatterboxNodeTreeItemProps
) {
  const router = useRouter();

  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [openAddFolderContentNode, setOpenAddFolderContentNode] =
    React.useState(false);

  const [openEditContentNode, setOpenEditContentNode] = React.useState(false);
  const [editableNode, setEditableNode] = React.useState(new ChatterboxNode());

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
            labelIcon: ChatBubbleOutlineIcon,
            labelText: "Chat",
            onClick: (event) => {
              event.stopPropagation();
              openChat();
            },
          },
          {
            labelIcon: DeveloperBoardIcon,
            labelText: "Process Data",
            onClick: (event) => {
              event.stopPropagation();
              mutationProcessData.mutate();
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
            labelIcon: CreateNewFolderIcon,
            labelText: "Add Folder",
            onClick: () => {
              setEditableNode(new FolderNode(node.id || ""));
              setOpenAddFolderContentNode(true);
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

      <FolderNodeFormModal
        key={1}
        open={openAddFolderContentNode}
        onClose={() => {
          setOpenAddFolderContentNode(false);
        }}
        onSave={() => {
          refetch();
          parentRefetch();
          setOpenAddFolderContentNode(false);
        }}
        node={editableNode}
      />

      <ChatterboxNodeFormModal
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
