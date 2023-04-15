import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { IconButton } from "@mui/material";
import React from "react";
import { UtilsContext } from "../../layout/utils.context";
import ConfirmationDialog from "../../shared/ConfirmationDialog";
import styles from "./invitations.module.css";
import { Invitation } from "./models/invitation";
import invitationsService from "./services/invitations.service";

type InvitationItemProps = {
  invitation: Invitation;
  updated: () => void;
};

type InvitationItemState = {
  openDeleteConfirmation: boolean;
};

export default class InvitationItem extends React.Component<
  InvitationItemProps,
  InvitationItemState
> {
  static contextType = UtilsContext;

  constructor(props: any) {
    super(props);
    this.state = {
      openDeleteConfirmation: false,
    };

    this.delete = this.delete.bind(this);
  }

  openConfirmationDialog = () => {
    this.setState({
      openDeleteConfirmation: true,
    });
  };

  public async delete() {
    await invitationsService.delete(this.props.invitation.id);
    this.props.updated();
    (this.context as any).showToast(
      "Invitation deleted successfully",
      "success"
    );
  }

  render() {
    return (
      <div className={styles.invitationItem}>
        <div className={styles.email}>
          {this.props.invitation.userReceivingEmail}
        </div>
        <div className={styles.rol}>{this.props.invitation.rol}</div>
        <div className={styles.status}>{this.props.invitation.status}</div>
        {this.props.invitation.status === "PENDING" ? (
          <>
            <div className={styles.resend}>
              <IconButton
                aria-label="share"
                onClick={this.openConfirmationDialog}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </div>
            <ConfirmationDialog
              open={this.state.openDeleteConfirmation}
              onClose={() => {
                this.setState({
                  openDeleteConfirmation: false,
                });
              }}
              message={
                "Are you sure to delete the invitation to " +
                this.props.invitation.userReceivingEmail +
                "?"
              }
              onAccept={() => {
                this.setState({
                  openDeleteConfirmation: false,
                });
                this.delete();
              }}
            />
          </>
        ) : null}
      </div>
    );
  }
}
