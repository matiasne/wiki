import React from "react";
import { MetricA } from "../models/metric";

import styles from "./metrics.module.css";
type MetricAValueProps = {
  metric: MetricA;
};

export default class MetricAValue extends React.Component<MetricAValueProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className={styles.valueWrapper}>
          <div
            style={{
              padding: 8,
              borderRadius: 50,
              width: "fit-content",
              minWidth: 38,
              height: 38,
              fontWeight: 600,
              color: "black",
              backgroundColor: "#eaeaea",
              lineHeight: 1,
              borderWidth: 4,
              borderColor: this.props.metric.getValueColor(),
            }}
          >
            {this.props.metric.currentValue}
          </div>
        </div>
      </>
    );
  }
}
