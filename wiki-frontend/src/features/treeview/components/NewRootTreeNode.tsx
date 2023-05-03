"use client";
import { SmallOutlinedButton } from "@/shared/components/SmallOutlinedButton";
import { useState } from "react";
import FolderNodeFormModal from "./folder-tree-item/FolderNodeFormModal";
import { useUpdateTreeViewRoot } from "./NodesTreeView";
import FolderNode from "../models/folderNode";
import ChatterboxNodeFormModal from "./chatterbox-tree-item/ChatterboxNodeFormModal";
import ChatterboxNode from "../models/chatterboxNode";

export interface INewRooTreeNodeProps {
  onSaved: () => void;
}

export default function NewRooTreeNode(props: INewRooTreeNodeProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const updateTreeView = useUpdateTreeViewRoot();
  return (
    <>
      <SmallOutlinedButton
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        New Chatterbox
      </SmallOutlinedButton>
      <ChatterboxNodeFormModal
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        onSave={() => {
          setOpenDialog(false);
          updateTreeView();
          props.onSaved();
        }}
        node={new ChatterboxNode()}
      />
    </>
  );
}
