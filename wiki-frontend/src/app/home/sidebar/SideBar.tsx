import { useUserAuth } from "@/features/auth/contexts/AuthContext";
import NewRooTreeNode from "@/features/treeview/components/NewRootTreeNode";
import GmailTreeView from "@/features/treeview/components/NodesTreeView";
import { useQuery } from "@tanstack/react-query";
import NodesTreeView from "@/features/treeview/components/NodesTreeView";

export interface ISideBarProps {}

export default function SideBar({}: ISideBarProps) {
  return (
    <>
      <NodesTreeView />
    </>
  );
}
