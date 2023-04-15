import { default as EditIcon } from "@mui/icons-material/Edit";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { DepartmentEditPermission } from "../../departments/components/DepartmentEditPermissions";
import { Department } from "../../departments/models/department";
import { MetricA } from "../models/metric";
import MetricADialogForm from "./MetricADialogEdit";
import MetricADialogEditValue from "./MetricADialogEditValue";
import MetricDialogInfo from "./MetricAInfoDialog";
import MetricValue from "./MetricAValue";
import styles from "./metrics.module.css";

type MetricAListItemProps = {
  department: Department;
  metric: MetricA;
  showConfig?: boolean;
  onEditSave: () => void;
  onEditDelete: () => void;
};

export default class MetricAOneLineInfo extends React.Component<MetricAListItemProps> {
  state = {
    openInfo: false,
    openEditValue: false,
    openEdit: false,
  };

  public handleClose = () => {
    this.setState((state) => ({
      openInfo: false,
    }));
  };

  constructor(props: any) {
    super(props);
  }

  onMetricClick() {
    this.setState({
      openInfo: true,
    });
  }

  onEditClick() {
    this.setState({
      openEditValue: true,
    });
  }

  public handleEditClose = () => {
    this.setState({
      openEdit: false,
    });
  };

  public handleEditOpen = () => {
    this.setState((state) => ({
      openEdit: true,
    }));
  };

  public handleCloseEditValue = () => {
    this.props.onEditSave();
    console.log("!!!!");
    this.setState((state) => ({
      openEditValue: false,
    }));
  };

  render() {
    return (
      <>
        <Card sx={{ marginTop: 1 }} className={styles.oneLineInfoCard}>
          <CardContent className={styles.paddingCard}>
            <Grid container spacing={2}>
              <Grid item xs={8} onClick={() => this.onMetricClick()}>
                <Typography className={styles.metricName}>
                  {this.props.metric.name}
                </Typography>
              </Grid>

              {this.props.showConfig ? (
                <Grid item xs={1}>
                  <Button
                    onClick={() => {
                      this.handleEditOpen();
                    }}
                  >
                    <MiscellaneousServicesIcon />
                  </Button>
                </Grid>
              ) : (
                <>
                  <Grid item xs={2}>
                    <MetricValue metric={this.props.metric} />
                  </Grid>
                  <Grid item xs={1}>
                    <DepartmentEditPermission
                      department={this.props.department}
                    >
                      <IconButton
                        aria-label="settings"
                        onClick={() => {
                          this.onEditClick();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </DepartmentEditPermission>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        <MetricADialogEditValue
          show={this.state.openEditValue}
          metric={this.props.metric}
          onClose={this.handleCloseEditValue}
          onSave={this.handleCloseEditValue}
        />

        <MetricADialogForm
          key={this.props.metric.id}
          show={this.state.openEdit}
          metric={this.props.metric}
          department={this.props.department}
          onClose={() => {
            this.handleEditClose();
          }}
          onSave={() => {
            this.handleEditClose();
            this.props.onEditSave();
          }}
          onDelete={() => {
            this.handleEditClose();
            this.props.onEditDelete();
          }}
        />

        <MetricDialogInfo
          open={this.state.openInfo}
          metric={this.props.metric}
          onClose={() => {
            this.handleClose();
          }}
          department={this.props.department}
        />
      </>
    );
  }
}
