import React from "react";
import styles from "./departmentHealth.module.css";

type DepartmentProps = {
  color: string;
  value: number;
};

type DepartmentState = {
  value: number;
};

export default class CircularPercentage extends React.Component<
  DepartmentProps,
  DepartmentState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidMount(): void {
    var current = 0;
    var stepTime = Math.abs(Math.floor(500 / this.props.value));

    let timer = setInterval(() => {
      current += 1;
      this.setState({ value: current });
      if (current >= this.props.value) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  render() {
    return (
      <>
        <div className={styles.valueWrapper}>
          <div className={styles.circleValue}>{this.props.value}</div>
          <svg viewBox="0 0 36 36" className={styles.circularChart}>
            <defs>
              <linearGradient id="gradient" x1="50%" y1="50%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={this.props.color} />
                <stop offset="100%" stopColor="#5eaefd" />
              </linearGradient>
            </defs>

            <path
              className={styles.circle}
              strokeDasharray={this.props.value + ", 100"}
              stroke="url(#gradient)"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </>
    );
  }
}
