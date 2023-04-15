import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { UtilsContext } from "../../../layout/utils.context";
import { Department } from "../../departments/models/department";
import { MetricA } from "../models/metric";
import metricsAService from "../services/metricsA.service";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid #eee",
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { m: 1 },
};

type MetricADialogProps = {
  show: boolean;
  metric?: MetricA;
  department: Department;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

type MetricDialogState = {
  currentMetric: MetricA;
  title: string;
  formValid: boolean;
  formSubmitted: boolean;
  isEditing: boolean;
  error: {
    name?: string;
    currentValue?: string;
    badThreshold?: string;
    goodThreshold?: string;
    thresholdGreen?: string;
  };
};

export default class MetricADialogForm extends React.Component<
  MetricADialogProps,
  MetricDialogState
> {
  static contextType = UtilsContext;

  state = {
    currentMetric: new MetricA(),
    title: "New Metric",
    isEditing: false,
    formValid: false,
    formSubmitted: false,
    error: {
      name: "",
      currentValue: "",
      badThreshold: "0",
      goodThreshold: "0",
      thresholdGreen: "0",
    },
  };

  constructor(props: any) {
    super(props);
    this.save = this.save.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.updateState();
  }

  updateState() {
    if (this.props.metric) {
      let metric = this.props.metric;

      metric.departmentId = this.props.department.id;
      this.setState({
        currentMetric: metric,
        title: "Edit Metric",
        isEditing: true,
      });
    } else {
      let metric = new MetricA();
      metric.departmentId = this.props.department.id;
      this.setState({
        currentMetric: metric,
        title: "New Metric",
        isEditing: false,
      });
    }
  }

  public async save() {
    this.state.currentMetric.departmentId = this.props.department.id;
    if (this.errorsValidations()) {
      if (this.state.currentMetric.id) {
        await metricsAService.update(this.state.currentMetric);
        (this.context as any).showToast("Metric updated", "success");
      } else {
        await metricsAService.createNew(this.state.currentMetric);
        (this.context as any).showToast("Metric created", "success");
      }

      this.props.onSave();
    }

    this.setState({
      formSubmitted: true,
    });
  }

  handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name: string = target.name;

    let updatedMetric: any = this.state.currentMetric;

    updatedMetric[name] = value;

    this.errorsValidations();

    this.setState({
      currentMetric: updatedMetric,
    } as Pick<any, keyof any>);
  }

  errorsValidations() {
    let errors = {
      name: "",
      currentValue: "",
      badThreshold: "",
      goodThreshold: "",
      thresholdGreen: "",
    };
    if (!this.state.currentMetric.name) {
      errors.name = "Please enter a name";
      (this.context as any).showToast("Please enter a name", "error");
      this.setState({
        error: errors,
      });
      return false;
    } else {
      errors.name = "";
    }
    return true;
  }

  async delete() {
    const resp = await metricsAService.delete(this.state.currentMetric.id);
    (this.context as any).showToast("Metric Deleted", "info");
    this.props.onDelete();
  }

  render() {
    return (
      <>
        <Dialog
          open={this.props.show}
          onClose={this.props.onClose}
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent>
            <Card variant="outlined" sx={{ marginTop: 1 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      label="Metric Name"
                      type="text"
                      size="small"
                      name="name"
                      value={this.state.currentMetric.name}
                      onChange={this.handleInputChange}
                      error={
                        this.state.error.name != "" && this.state.formSubmitted
                      }
                      helperText={this.state.error.name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Actual Value"
                      type="number"
                      size="small"
                      name="currentValue"
                      value={this.state.currentMetric.currentValue}
                      onChange={this.handleInputChange}
                      helperText={this.state.error.currentValue}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Thresholds
                </Typography>

                <TextField
                  label="Bad Threshold Value"
                  type="number"
                  size="small"
                  name="badThreshold"
                  value={this.state.currentMetric.badThreshold}
                  onChange={this.handleInputChange}
                  helperText={this.state.error.badThreshold}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🟥</InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Good Threshold Value"
                  type="number"
                  size="small"
                  name="goodThreshold"
                  value={this.state.currentMetric.goodThreshold}
                  onChange={this.handleInputChange}
                  helperText={this.state.error.goodThreshold}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🟨</InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      name="showColor"
                      value={this.state.currentMetric.showColor}
                      onChange={this.handleInputChange}
                    />
                  }
                  label="Show Colors on App"
                />
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 1 }}>
              <CardContent>
                <TextField
                  label="Weighting(out of 100)"
                  type="number"
                  size="small"
                  name="weighting"
                  value={this.state.currentMetric.weighting}
                  onChange={this.handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Penalty"
                  type="number"
                  size="small"
                  name="penalty"
                  value={this.state.currentMetric.penalty}
                  onChange={this.handleInputChange}
                />

                <TextField
                  disabled
                  label="Over Threshold"
                  size="small"
                  value={this.state.currentMetric.OverThresholdPercent()}
                />

                <TextField
                  disabled
                  label="Weighted score"
                  size="small"
                  value={this.state.currentMetric.getWeightedScore()}
                />
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Description
                </Typography>

                <TextareaAutosize
                  aria-label="minimum height"
                  placeholder="Minimum 3 rows"
                  name="description"
                  value={this.state.currentMetric.description}
                  onChange={this.handleInputChange}
                  style={{ width: 500 }}
                />
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            {this.state.isEditing ? (
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  this.delete();
                }}
              >
                Delete
              </Button>
            ) : null}
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button
              onClick={async () => {
                await this.save();
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
