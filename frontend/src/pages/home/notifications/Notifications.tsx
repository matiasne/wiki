import React from "react";
import NotificationsList from "../../../features/notifications/components/NotificationList";
import globalStyles from "../../../global.module.css";
import NavBar from "../../../layout/NavBar";

export default class Notifications extends React.Component {
  constructor(props: any) {
    super(props);
  }

  onNotificationClick(): void {}

  render() {
    return (
      <div>
        <NavBar />
        <div className={globalStyles.pageContainer}>
          <NotificationsList />
        </div>
      </div>
    );
  }
}
