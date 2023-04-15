import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import ConfirmationDialog from "../../../shared/ConfirmationDialog";
import { EnumNotificationType, Notification } from "../models/notification";
import styles from "./notification.module.css";

type NotificationItemProps = {
  notification: Notification;
  handleAccept: () => void;
  handleDecline: () => void;
};

type NotificationItemState = {
  openDeleteConfirmation: boolean;
};

export default class NotificationItem extends React.Component<
  NotificationItemProps,
  NotificationItemState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      openDeleteConfirmation: false,
    };
    this.openConfirm = this.openConfirm.bind(this);
  }

  openConfirm() {
    this.setState({
      openDeleteConfirmation: true,
    });
  }

  render() {
    return (
      <>
        <Card sx={{ marginTop: 1 }}>
          <CardContent className={styles.paddingCard}>
            <Typography className={styles.metricName}>
              {this.props.notification.message}
            </Typography>
          </CardContent>
          <CardActions>
            {this.props.notification.type == EnumNotificationType.INVITATION ? (
              <>
                <CardActions>
                  <Button onClick={this.props.handleAccept}>Aceept</Button>
                  <Button onClick={this.openConfirm}>Decline</Button>
                </CardActions>
              </>
            ) : null}
          </CardActions>
        </Card>
        <ConfirmationDialog
          open={this.state.openDeleteConfirmation}
          onClose={() => {
            this.setState({
              openDeleteConfirmation: false,
            });
          }}
          message={"Are you sure to decline this invitation?"}
          onAccept={() => {
            this.setState({
              openDeleteConfirmation: false,
            });
            this.props.handleDecline();
          }}
        />
      </>
    );
  }
}
