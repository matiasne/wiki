import React from "react";
import { Department } from "../../departments/models/department";

import MetricAOneLineInfo from "./MetricAOneLineInfo";

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

type ListState = {
  open: boolean;
  openEditValue: boolean;
};

type ListProps = {
  showConfig?: boolean;
  department: Department;
  onChange: () => void;
};

export default class MetricsAList extends React.Component<
  ListProps,
  ListState
> {
  state = { open: false, openEditValue: false, metrics: [] };

  public handleOpen = () => {
    this.setState((state) => ({
      open: true,
    }));
  };

  public handleOpenEditValue = () => {
    this.setState((state) => ({
      openEditValue: true,
    }));
  };

  public handleCloseEditValue = () => {
    this.setState((state) => ({
      openEditValue: false,
    }));
    this.props.onChange();
  };

  public handleClose = () => {
    this.setState((state) => ({
      open: false,
    }));
  };

  constructor(props: any) {
    super(props);
  }

  componentDidUpdate(prevProps: any, prevState: any) {}

  render() {
    return (
      <>
        {this.props.department.metrics.length === 0 && (
          <div className="text-center">
            This Department doesn't have any metric
          </div>
        )}
        {this.props.department.metrics.map((metric, i) => (
          <MetricAOneLineInfo
            key={i}
            department={this.props.department}
            metric={metric}
            showConfig={this.props.showConfig}
            onEditSave={() => {
              this.handleCloseEditValue();
            }}
            onEditDelete={() => {
              this.handleCloseEditValue();
            }}
          />
        ))}
      </>
    );
  }
}
