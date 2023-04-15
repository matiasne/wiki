import React from "react";
import StyledTreeItem from "./StyledTreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { TreeItemProps } from "@mui/lab";
import AddNewFolderModal from "./AddNewFolderModal";
type FolderTreeItemProps = TreeItemProps & {
  labelInfo?: string;
  labelText: string;
};

export default function FolderTreeItem(props: FolderTreeItemProps) {
  const [open, setOpen] = React.useState(false);
  const [openNewFolder, setOpenNewFolder] = React.useState(false);
  const { labelInfo, labelText, nodeId, children, ...other } = props;

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
        actionButtons={[
          {
            labelIcon: CreateNewFolderIcon,
            labelText: "Add Folder",
            onClick: () => {
              setOpenNewFolder(true);
            },
          },
          {
            labelIcon: InsertDriveFileIcon,
            labelText: "Add Element",
            onClick: () => {
              console.log("delete");
            },
          },
        ]}
      >
        {children}
      </StyledTreeItem>
      <AddNewFolderModal
        open={openNewFolder}
        onClose={() => {
          setOpenNewFolder(false);
        }}
        onSave={() => {
          setOpenNewFolder(false);
        }}
      />
    </>
  );
}
