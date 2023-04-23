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
import StyledTreeItem from "./tree-item/StyledTreeItem";
import FolderTreeItem from "./tree-item/FolderTreeItem";
import INodeRootResponseDTO from "../models/nodeFolderResponseDTO";
import { createContext, useContext } from "react";
import { useUserAuth } from "@/features/auth/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import NewRooTreeNode from "./NewRootTreeNode";
import NodeService from "@/features/treeview/services/node.service";
import { EnumContentNodeType } from "../models/newFolderDTO";

export const UpdateTreeContext = createContext(() => {});

export function useUpdateTreeView() {
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

  const refreshTree = () => {
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
        sx={{ height: "100vh", flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        <UpdateTreeContext.Provider value={refreshTree}>
          {!isLoadingNodesData
            ? nodesData!.data.map((node: INodeRootResponseDTO) => {
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
            : null}
        </UpdateTreeContext.Provider>
        {/*
        <FolderTreeItem nodeId="1" labelText="All Mail" />
        <StyledTreeItem
          nodeId="2"
          labelText="Trash"
          labelIcon={DeleteIcon}
          clickHandler={function (): void {}}
        />
        <FolderTreeItem nodeId="3" labelText="Categories" labelInfo="90">
          <FolderTreeItem
            nodeId="5"
            labelText="Social"
            labelInfo="90"
            color="#1a73e8"
          >
            <StyledTreeItem
              nodeId="25"
              labelText="Social"
              labelIcon={SupervisorAccountIcon}
              labelInfo="90"
              color="#1a73e8"
              bgColor="#e8f0fe"
              clickHandler={function (): void {}}
            ></StyledTreeItem>
          </FolderTreeItem>
          <StyledTreeItem
            nodeId="6"
            labelText="Updates"
            labelIcon={InfoIcon}
            labelInfo="2,294"
            color="#e3742f"
            bgColor="#fcefe3"
            clickHandler={function (): void {}}
          />
          <StyledTreeItem
            nodeId="7"
            labelText="Forums"
            labelIcon={ForumIcon}
            labelInfo="3,566"
            color="#a250f5"
            bgColor="#f3e8fd"
            clickHandler={function (): void {}}
          />
          <StyledTreeItem
            nodeId="8"
            labelText="Promotions"
            labelIcon={LocalOfferIcon}
            labelInfo="733"
            color="#3c8039"
            bgColor="#e6f4ea"
            clickHandler={function (): void {}}
          />
        </FolderTreeItem>
        <StyledTreeItem
          nodeId="4"
          labelText="History"
          labelIcon={Label}
          clickHandler={function (): void {}}
            />*/}
      </TreeView>
    </>
  );
}
