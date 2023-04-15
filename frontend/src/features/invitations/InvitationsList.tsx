import React from "react";
import InvitationItem from "./invitationItem";
import InvitationSendButton from "./InvitationSendButton";
import { Invitation } from "./models/invitation";
import invitationsService from "./services/invitations.service";

type InvitationsListProps = {
  departmentId: string | undefined;
};

type InvitationsListState = {
  invitations: any[];
};

export default class InvitationsList extends React.Component<
  InvitationsListProps,
  InvitationsListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      invitations: [],
    };
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps: any, prevState: any) {}

  async refresh() {
    this.setState({
      invitations: [],
    });

    let invitations: any[] = await invitationsService.getAllByDepartment(
      this.props.departmentId as string
    );

    if (invitations && invitations.length > 0) {
      this.setState({
        invitations: invitations,
      });
    }
  }

  render() {
    return (
      <>
        {this.state.invitations.map((invitation: Invitation, i) => {
          return (
            <InvitationItem
              key={i}
              invitation={invitation}
              updated={() => this.refresh()}
            />
          );
        })}
        <InvitationSendButton
          departmentId={this.props.departmentId}
          onSend={() => {
            this.refresh();
          }}
        />
      </>
    );
  }
}
