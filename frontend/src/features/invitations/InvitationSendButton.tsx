import { Button } from "@mui/material";
import React from "react";
import InviteUserDialog from "./InviteUserDialog";

type InvitationSendButtonProps = {
  departmentId: string | undefined;
  onSend: () => void;
};

type InvitationSendButtonState = {
  openInviteUser: boolean;
};

export default class InvitationSendButton extends React.Component<
  InvitationSendButtonProps,
  InvitationSendButtonState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      openInviteUser: false,
    };

    this.onInviteClick = this.onInviteClick.bind(this);
    this.closeInviteDialog = this.closeInviteDialog.bind(this);
  }

  componentDidMount() {
    this.setState({
      openInviteUser: false,
    });
  }

  onInviteClick() {
    this.setState({
      openInviteUser: true,
    });
  }

  closeInviteDialog() {
    this.setState({
      openInviteUser: false,
    });
  }

  render() {
    return (
      <>
        <Button onClick={this.onInviteClick}>Invite User</Button>

        <InviteUserDialog
          show={this.state.openInviteUser}
          onClose={() => {
            this.closeInviteDialog();
          }}
          onSend={() => {
            this.props.onSend();
            this.closeInviteDialog();
          }}
          departmentId={this.props.departmentId ?? ""}
        ></InviteUserDialog>
      </>
    );
  }
}
