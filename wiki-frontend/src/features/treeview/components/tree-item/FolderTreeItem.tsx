"use client";
import React, { useContext } from "react";
import StyledTreeItem from "./StyledTreeItem";
import FolderIcon from "@mui/icons-material/Folder";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TreeItemProps } from "@mui/lab";
import AddNewFolderModal from "./AddNewFolderModal";
import { useQuery } from "@tanstack/react-query";
import NodeService from "@/features/treeview/services/node.service";
import { EnumContentNodeType } from "../../models/newFolderDTO";
import { useUpdateTreeView } from "../NodesTreeView";

type FolderTreeItemProps = TreeItemProps & {
  labelInfo?: string;
  labelText: string;
};

export default function FolderTreeItem(props: FolderTreeItemProps) {
  const [open, setOpen] = React.useState(false);
  const [openNewFolder, setOpenNewFolder] = React.useState("");
  const { labelInfo, labelText, nodeId, children, ...other } = props;

  const updateTreeView = useUpdateTreeView();

  const {
    data: childsData,
    isLoading: isLoadingchildsData,
    isError: errorchildsData,
    refetch,
  } = useQuery({
    queryKey: ["RootNodesUserId", nodeId],
    queryFn: async () => await NodeService.getChilds(nodeId),
    refetchOnWindowFocus: false,
  });

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledTreeItem
        nodeId={nodeId}
        labelText={labelText}
        labelIcon={FolderIcon}
        clickHandler={toggleOpen}
        actionbuttons={[
          {
            labelIcon: CreateNewFolderIcon,
            labelText: "Add Folder",
            onClick: () => {
              setOpenNewFolder(nodeId);
            },
          },
          {
            labelIcon: InsertDriveFileIcon,
            labelText: "Add Element",
            onClick: () => {},
          },
        ]}
      >
        {!isLoadingchildsData && childsData.data.childrens ? (
          childsData.data.childrens.map((node: any) => {
            console.log(node);
            if (node.type === EnumContentNodeType.FOLDER) {
              return (
                <FolderTreeItem
                  key={node.id}
                  nodeId={node.id}
                  labelText={node.name}
                />
              );
            }
          })
        ) : (
          <></>
        )}
      </StyledTreeItem>

      <AddNewFolderModal
        open={openNewFolder !== ""}
        onClose={() => {
          console.log("refresh tree");
          setOpenNewFolder("");
        }}
        onSave={() => {
          refetch();
          console.log("refresh tree");
          updateTreeView();
          setOpenNewFolder("");
        }}
        parentId={"" + openNewFolder}
      />
    </>
  );
}
