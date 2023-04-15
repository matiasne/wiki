import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { IconButton } from "@mui/material";
import React from "react";
import { useUserAuth } from "../../../AuthContext";
import ConfirmationDialog from "../../../shared/ConfirmationDialog";
import usersDepartmentService from "../services/usersDepartment.service";
import styles from "./userRoles.module.css";

type UserRolItemProps = {
  userRol: any;
  updated: () => void;
};

export const UserRolItem = ({ userRol, updated }: UserRolItemProps) => {
  const getUser: any = useUserAuth();

  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    React.useState(false);

  const remove = async () => {
    await usersDepartmentService.delete(userRol.id);
    updated();
  };

  const openConfirmationDialog = () => {
    setOpenDeleteConfirmation(true);
  };

  return (
    <>
      <div className={styles.userRolItem}>
        <div className={styles.email}>{userRol.email}</div>
        <div className={styles.rol}>{userRol.rol}</div>
        {userRol.email !== getUser().email ? (
          <IconButton aria-label="share" onClick={openConfirmationDialog}>
            <DeleteOutlinedIcon />
          </IconButton>
        ) : null}
      </div>

      <ConfirmationDialog
        open={openDeleteConfirmation}
        onClose={() => {
          setOpenDeleteConfirmation(false);
        }}
        message={"Are you sure to delete the user ?"}
        onAccept={() => {
          setOpenDeleteConfirmation(false);
          remove();
        }}
      />
    </>
  );
};
