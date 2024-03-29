"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import NodeService from "../../services/node.service";
import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "@/features/auth/contexts/AuthContext";

type DataMoveToFolderModalProps = {
  open: boolean;
  node: any;
  onClose: () => void;
  onSave: () => void;
};

export default function DataMoveToFolderModal({
  open,
  node,
  onClose,
  onSave,
}: DataMoveToFolderModalProps) {
  const getUser: any = useUserAuth();
  const [selectedFolder, setSelectedFolder] = useState("");

  const {
    data: nodesData,
    isLoading: isLoadingNodesData,
    isError: errorNodesData,
    refetch,
  } = useQuery({
    queryKey: ["MoveNodesUserId", getUser.id],
    queryFn: async () => await NodeService.getAll(),
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    //onSave();
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Move to folder</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {!isLoadingNodesData ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={nodesData!.data}
              getOptionLabel={(option: any) => option.name}
              sx={{ width: 300 }}
              onChange={(event: any, newValue: any | null) => {
                setSelectedFolder(newValue.id);
              }}
              renderInput={(params) => <TextField {...params} label="Folder" />}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Move</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
