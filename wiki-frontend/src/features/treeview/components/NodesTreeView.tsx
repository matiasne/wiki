"use client";
import * as React from "react";

import TreeView from "@mui/lab/TreeView";

import DeleteIcon from "@mui/icons-material/Delete";
import Label from "@mui/icons-material/Label";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StyledTreeItem from "./StyledTreeItem";
import FolderTreeItem from "./folder-tree-item/FolderNodeTreeItem";
import INodeRootResponseDTO from "../models/nodeFolderResponseDTO";
import { createContext, useContext } from "react";
import { useUserAuth } from "@/features/auth/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import NewRooTreeNode from "./NewRootTreeNode";
import NodeService from "@/features/treeview/services/node.service";
import ContentNodeTreeItem from "./folder-tree-item/FolderNodeTreeItem";
import FolderNodeTreeItem from "./folder-tree-item/FolderNodeTreeItem";
import FolderNode from "../models/folderNode";
import ChatterboxNodeTreeItem from "./chatterbox-tree-item/ChatterboxNodeTreeItem";
import ChatterboxNode from "../models/chatterboxNode";

export const UpdateTreeContext = createContext(() => {});

export function useUpdateTreeViewRoot() {
  return useContext(UpdateTreeContext);
}

export default function NodesTreeView(): JSX.Element {
  const getUser: any = useUserAuth();

  const {
    data: nodesData,
    isLoading: isLoadingNodesData,
    isError: errorNodesData,
    refetch,
  } = useQuery({
    queryKey: ["RootNodesUserId", getUser.id],
    queryFn: async () => await NodeService.getRoot(),
    refetchOnWindowFocus: false,
  });

  const refreshRoot = () => {
    console.log("refreshing tree");
    refetch();
  };

  return (
    <>
      <NewRooTreeNode
        onSaved={function (): void {
          refetch();
        }}
      />

      <TreeView
        aria-label="gmail"
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultExpanded={["3"]}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{
          height: "100vh",
          flexGrow: 1,
          maxWidth: 400,
          overflowY: "auto",
        }}
      >
        <UpdateTreeContext.Provider value={refreshRoot}>
          {!isLoadingNodesData && nodesData && nodesData.data
            ? nodesData!.data.map((node: INodeRootResponseDTO, i: any) => {
                let chatterboxNode = ChatterboxNode.TransformFromDTO(node);

                return (
                  <ChatterboxNodeTreeItem
                    key={i}
                    parentRefetch={() => {
                      refetch();
                    }}
                    node={chatterboxNode}
                  />
                );
              })
            : null}
        </UpdateTreeContext.Provider>
      </TreeView>
    </>
  );
}
