import { default as EditIcon } from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { convertISOStringToMonthDay } from "../../../common/util/date";
import globalStyles from "../../../global.module.css";
import MetricAOneLineInfo from "../../metrics/components/MetricAOneLineInfo";
import { MetricA } from "../../metrics/models/metric";
import { Department } from "../models/department";
import departmentsService from "../services/departments.service";
import styles from "./departmentCard.module.css";
import { DepartmentEditPermission } from "./DepartmentEditPermissions";
import CircularPercentage from "./DepartmentHealth";

enum MetricList {
  all = "All",
  top = "Top",
}

type DepartmentProps = {
  departmentId: string | undefined;
};

type DepartmentState = {
  metricListSelected: MetricList;
  department: Department;
};

export default class DepartmentCard extends React.Component<
  DepartmentProps,
  DepartmentState
> {
  constructor(props: DepartmentProps) {
    super(props);

    this.state = {
      metricListSelected: MetricList.all,
      department: new Department(),
    };
    this.refresh = this.refresh.bind(this);
  }

  public refresh() {
    departmentsService
      .getById(this.props.departmentId)
      .then((department: any) => {
        if (department) this.setState({ department: department });
      });
  }

  public handleSelectAll = () => {
    this.setState({ metricListSelected: MetricList.all });
  };

  public handleSelectTop = () => {
    this.setState({ metricListSelected: MetricList.top });
  };

  public handleCloseEditValue = () => {
    this.refresh();
  };

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.departmentId !== this.props.departmentId) {
      this.refresh();
    }
  }

  render() {
    return (
      <>
        <Card className={globalStyles.objectCard}>
          <CardContent>
            <CardHeader
              action={
                <DepartmentEditPermission department={this.state.department}>
                  <Link to={"/home/editDepartment/" + this.state.department.id}>
                    <IconButton aria-label="settings">
                      <EditIcon />
                    </IconButton>
                  </Link>
                </DepartmentEditPermission>
              }
              title={this.state.department.name}
              subheader={convertISOStringToMonthDay(
                new Date().toISOString().slice(0, -3)
              )}
            />
            <div className={styles.container}>
              <CircularPercentage
                color={this.state.department.getScoreColor()}
                value={this.state.department.getHelathScore()}
              />
              <h2 className={styles.circleLabel}>Health Score</h2>
            </div>

            {this.state.metricListSelected === MetricList.all ? (
              <>
                <Button variant="text" onClick={this.handleSelectTop}>
                  Todays Top 3
                </Button>
                <Button variant="outlined" onClick={this.handleSelectAll}>
                  All
                </Button>

                {this.state.department.metrics.map((metric: MetricA, i) => (
                  <MetricAOneLineInfo
                    department={this.state.department}
                    key={metric.id}
                    metric={metric}
                    onEditSave={() => {
                      this.handleCloseEditValue();
                    }}
                    onEditDelete={() => {
                      this.handleCloseEditValue();
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={this.handleSelectTop}>
                  Todays Top 3
                </Button>
                <Button variant="text" onClick={this.handleSelectAll}>
                  All
                </Button>
                {this.state.department.metrics
                  .sort((a, b) => {
                    return (
                      b.OverBadThresholdValue() - a.OverBadThresholdValue()
                    );
                  })
                  .slice(0, 3)
                  .map((metric: MetricA, i) => (
                    <MetricAOneLineInfo
                      department={this.state.department}
                      key={metric.id}
                      metric={metric}
                      onEditSave={() => {
                        this.handleCloseEditValue();
                      }}
                      onEditDelete={() => {
                        this.handleCloseEditValue();
                      }}
                    />
                  ))}
              </>
            )}
          </CardContent>
        </Card>
      </>
    );
  }
}
