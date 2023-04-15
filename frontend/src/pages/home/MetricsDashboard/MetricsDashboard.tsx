import { TextField } from "@mui/material";
import React from "react";
import MetricAInfo from "../../../features/metrics/components/MetricAInfo";
import { MetricA } from "../../../features/metrics/models/metric";
import metricsAService from "../../../features/metrics/services/metricsA.service";
import globalStyles from "../../../global.module.css";
import { UtilsContext } from "../../../layout/utils.context";

type MetricListItemState = {
  metrics: MetricA[];
  filteredMetrics: MetricA[];
  searchString: string;
};

class MetricsDashboard extends React.Component<{}, MetricListItemState> {
  static contextType = UtilsContext;
  timer: any;

  constructor(props: any) {
    super(props);
    this.state = {
      searchString: "",
      metrics: [],
      filteredMetrics: [],
    };
  }

  async componentDidMount(): Promise<void> {
    (this.context as any).showLoader();
    const metrics = await metricsAService.getAll();
    this.setState({ metrics: metrics });
    this.setState({ filteredMetrics: metrics });
    (this.context as any).hideLoader();
  }

  handleDebouncedSearch(value: any) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        filteredMetrics: this.state.metrics.filter((metric: MetricA) => {
          return metric.name.toLowerCase().includes(value.toLowerCase());
        }),
      });
    }, 500);
  }

  render() {
    return (
      <>
        <div className={globalStyles.pageContainer}>
          <TextField
            label="Search"
            type="text"
            size="small"
            name="name"
            onChange={(e) => this.handleDebouncedSearch(e.target.value)}
            fullWidth
          />

          {this.state.filteredMetrics.length === 0 &&
            this.state.searchString == "" && (
              <div className="text-center">You don't have metrics assigned</div>
            )}

          {this.state.filteredMetrics.map((metric: MetricA, i) => (
            <MetricAInfo
              key={i}
              metric={metric}
              onChartClick={() => {}}
              onShareClick={() => {}}
            />
          ))}
        </div>
      </>
    );
  }
}

export default MetricsDashboard;
