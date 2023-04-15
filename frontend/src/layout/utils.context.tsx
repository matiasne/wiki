import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

import { RotatingLines } from "react-loader-spinner";
import styles from "./layout.module.css";

type LoaderProps = {
  isLoaderShow: boolean;
  children: React.ReactElement<any, any>;
};

type LoaderState = {
  loading: boolean;
  openToast: boolean;
  toastMessage: string;
  severity: AlertColor | undefined;
};

export const UtilsContext = React.createContext({});

export default class LoaderProvider extends React.Component<
  LoaderProps,
  LoaderState
> {
  constructor(props: LoaderProps) {
    super(props);
    this.state = {
      loading: false,
      openToast: false,
      toastMessage: "",
      severity: "success",
    };
  }
  showLoader = () => this.setState({ loading: true });
  hideLoader = () => this.setState({ loading: false });

  showToast = (toastMessage: string, severity: AlertColor | undefined) =>
    this.setState({
      openToast: true,
      toastMessage: toastMessage,
      severity: severity,
    });
  hideToast = () => this.setState({ openToast: false });

  render() {
    const { loading } = this.state;
    const funcs: any = {
      showLoader: this.showLoader,
      hideLoader: this.hideLoader,
      showToast: (message: string, severity: AlertColor | undefined) => {
        this.showToast(message, severity);
      },
      hideToast: this.hideToast,
    };

    return (
      <>
        <UtilsContext.Provider value={funcs}>
          {this.props.children}
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}>
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={loading}
                />
              </div>
            </div>
          ) : null}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.openToast}
            autoHideDuration={6000}
            onClose={this.hideToast}
          >
            <Alert
              onClose={this.hideToast}
              severity={this.state.severity}
              sx={{ width: "100%" }}
            >
              {this.state.toastMessage}
            </Alert>
          </Snackbar>
        </UtilsContext.Provider>
      </>
    );
  }
}
