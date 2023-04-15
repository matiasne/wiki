import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import { UtilsContext } from "../../../layout/utils.context";
import { Metric, MetricA } from "../models/metric";
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
  metric: Metric;
  onClose: () => void;
  onSave: () => void;
};

type MetricADialogState = {
  currentMetric: Metric;
  title: string;
  formValid: boolean;
  formSubmitted: boolean;
  error: {
    currentValue?: string;
  };
};

export default class MetricADialogEditValue extends React.Component<
  MetricADialogProps,
  MetricADialogState
> {
  static contextType = UtilsContext;

  state = {
    currentMetric: new MetricA(),
    title: "Edit Metric Value",
    formValid: false,
    formSubmitted: false,
    error: {
      currentValue: "",
    },
  };

  constructor(props: any) {
    super(props);
    this.save = this.save.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    let actualMetric = this.props.metric;
    this.setState({
      currentMetric: actualMetric,
    });
  }

  public async save() {
    this.errorsValidations();
    await metricsAService.update(this.state.currentMetric);
    this.setState({
      formSubmitted: true,
    });
    (this.context as any).showToast("Value Saved", "success");
    this.props.onSave();
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
    this.setState({
      formValid: true,
    });

    let errors = {
      currentValue: "",
    };

    if (!this.state.currentMetric.currentValue) {
      errors.currentValue = "Please enter a value";
      this.setState({
        formValid: false,
        error: errors,
      });
    } else {
      errors.currentValue = "";
    }
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
            <TextField
              label="Actual Value"
              type="number"
              size="small"
              name="currentValue"
              value={this.state.currentMetric.currentValue}
              onChange={this.handleInputChange}
              error={
                this.state.error.currentValue != "" && this.state.formSubmitted
              }
              helperText={this.state.error.currentValue}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button
              onClick={() => {
                this.save();
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
