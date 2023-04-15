import React from "react";
import { UtilsContext } from "../../../layout/utils.context";
import InvitationsService from "../../invitations/services/invitations.service";
import { Notification } from "../models/notification";
import NotificationService from "../services/notification.service";
import NotificationItem from "./NotificationItem";

type NotificationsListState = {
  notifications: any[];
};

export default class NotificationsList extends React.Component<
  {},
  NotificationsListState
> {
  static contextType = UtilsContext;

  constructor(props: any) {
    super(props);
    this.state = {
      notifications: [],
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  async refresh() {
    let noti = await NotificationService.getMy();
    this.setState({ notifications: noti });
  }

  public handleAcceptNotification = (notification: Notification) => {
    InvitationsService.accept(notification.typeRefUID).then((res) => {
      this.refresh();
      (this.context as any).showToast("Invitation accepted", "success");
    });
  };

  handleDeclineNotification = (notification: Notification) => {
    InvitationsService.decline(notification.typeRefUID).then((res) => {
      (this.context as any).showToast("Invitation declined", "info");
      this.refresh();
    });
  };

  render() {
    return (
      <>
        {this.state.notifications.length === 0 && (
          <div className="text-center">You don't have notifications</div>
        )}
        {this.state.notifications.map((notification: Notification, i) => {
          return (
            <NotificationItem
              key={i}
              notification={notification}
              handleAccept={() => this.handleAcceptNotification(notification)}
              handleDecline={() => this.handleDeclineNotification(notification)}
            />
          );
        })}
      </>
    );
  }
}
