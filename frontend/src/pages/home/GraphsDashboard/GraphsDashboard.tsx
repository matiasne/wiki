import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Department } from "../../../features/departments/models/department";
import departmentsService from "../../../features/departments/services/departments.service";
import { MetricA } from "../../../features/metrics/models/metric";
import {
  FieldDTO,
  RegisterDTO,
} from "../../../features/metrics/models/metric-dto";
import metricsAService from "../../../features/metrics/services/metricsA.service";
import { User } from "../../../features/users/models/user";
import usersService from "../../../features/users/services/users.service";
import globalStyles from "../../../global.module.css";
import { UtilsContext } from "../../../layout/utils.context";

type GraphDashboardState = {
  from: string;
  to: string;
  department: Department;
  metricId: string;
  chartData: RegisterDTO[];
};

type GraphDashboardProps = {
  departmentId?: string;
};

class GraphDashboard extends React.Component<
  GraphDashboardProps,
  GraphDashboardState
> {
  static contextType = UtilsContext;

  constructor(props: any) {
    super(props);
    this.state = {
      department: new Department(),
      from: moment().add(-7, "days").format(),
      to: moment().format(),
      metricId: "",
      chartData: [],
    };
  }

  async componentDidMount(): Promise<void> {
    (this.context as any).showLoader();
    if (this.props.departmentId) {
      const dept = await departmentsService.getById(this.props.departmentId);
      if (dept) this.setState({ department: dept });
    } else {
      const user: User = await usersService.getMy();

      if (user.getFirstDepartmentOwnerId()) {
        let d = await departmentsService.getById(
          user.getFirstDepartmentOwnerId()
        );

        if (d) this.setState({ department: d });
      }
    }

    if (this.state.department.metrics[0]) {
      this.setState({ metricId: this.state.department.metrics[0].id! }, () => {
        this.convertData();
      });
    }

    (this.context as any).hideLoader();
  }

  async convertData() {
    let data = await metricsAService.getResgitersBetweenDates(
      this.state.metricId!,
      this.state.from,
      this.state.to
    );

    const field: FieldDTO = await data.fields.find(
      (field: any) => field.name === "currentValue"
    )!;

    console.log(field.registers);

    this.setState({ chartData: field.registers });
  }

  handleMetricChange(id: string) {
    this.setState({ metricId: id! });

    this.convertData();
  }

  handleFromChange = (newValue: any | null) => {
    this.setState({ from: newValue.format() }, () => {
      this.convertData();
    });
  };

  handleToChange = (newValue: any | null) => {
    this.setState({ to: newValue.add(1, "days").format() }, () => {
      this.convertData();
    });
  };

  render() {
    return (
      <div className={globalStyles.pageBackground}>
        <div className={globalStyles.pageContainer}>
          <Card className={globalStyles.objectCard}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {this.state.department ? (
                    <Typography
                      sx={{
                        fontSize: 14,
                        paddingTop: 2,
                        textAlign: "left",
                      }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {this.state.department.name}
                    </Typography>
                  ) : null}
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Metric
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Department"
                      onChange={(e) => this.handleMetricChange(e.target.value)}
                      value={this.state.metricId}
                    >
                      {this.state.department.metrics.map(
                        (metric: MetricA, i) => (
                          <MenuItem key={i} value={metric.id}>
                            {metric.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <MobileDatePicker
                    label="From Date"
                    value={this.state.from}
                    onChange={this.handleFromChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MobileDatePicker
                    label="To Date"
                    value={this.state.to}
                    onChange={this.handleToChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
              <div
                style={{
                  width: "100%",
                  height: 300,
                  marginLeft: -40,
                  marginTop: 50,
                }}
              >
                <ResponsiveContainer>
                  <LineChart
                    width={500}
                    height={300}
                    data={this.state.chartData}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="updateDateTime" />
                    <YAxis type="number" domain={[0, "dataMax + 100"]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default function (props: any) {
  let { departmentId } = useParams();

  return <GraphDashboard {...props} departmentId={departmentId} />;
}
