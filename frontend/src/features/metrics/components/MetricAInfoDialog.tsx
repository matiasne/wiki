import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import CustomDialog from "../../../shared/CustomDialog";
import { Department } from "../../departments/models/department";
import { MetricA } from "../models/metric";
import MetricAInfo from "./MetricAInfo";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type MetricADialogInfoProps = {
  open: boolean;
  onClose: () => void;
  metric: MetricA;
  department: Department;
};

export default class MetricADialogInfo extends React.Component<
  MetricADialogInfoProps,
  {}
> {
  constructor(props: MetricADialogInfoProps) {
    super(props);
  }

  render() {
    return (
      <>
        <CustomDialog
          open={this.props.open}
          onClose={() => {
            this.props.onClose();
          }}
        >
          <MetricAInfo
            metric={this.props.metric}
            department={this.props.department}
            onChartClick={() => {
              this.props.onClose();
            }}
            onShareClick={() => {
              this.props.onClose();
            }}
          />
        </CustomDialog>
      </>
    );
  }
}
