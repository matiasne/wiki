import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import styles from "./dialog.module.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type CustomDialogProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactElement<any, any>;
};

type CustomDialogState = {
  open: boolean;
};

export default class CustomDialog extends React.Component<
  CustomDialogProps,
  CustomDialogState
> {
  constructor(props: CustomDialogProps) {
    super(props);
  }

  render() {
    return (
      <>
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.props.onClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <IconButton
            onClick={() => {
              this.props.onClose();
            }}
            aria-label="close"
            className={styles.closeDialogIcon}
          >
            <CloseIcon />
          </IconButton>
          {this.props.children}
        </Dialog>
      </>
    );
  }
}
