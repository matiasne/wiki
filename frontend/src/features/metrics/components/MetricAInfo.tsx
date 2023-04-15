import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ShareIcon from "@mui/icons-material/Share";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import globalStyles from "../../../global.module.css";
import { Department } from "../../departments/models/department";
import { MetricA } from "../models/metric";
import MetricAValue from "./MetricAValue";
import styles from "./metrics.module.css";
type MetricInfoProps = {
  metric: MetricA;
  department?: Department;
  onChartClick: () => void;
  onShareClick: () => void;
};

export default class MetricAInfo extends React.Component<MetricInfoProps, {}> {
  state = {
    openEdit: false,
  };

  constructor(props: MetricInfoProps) {
    super(props);
  }

  handleEditClose() {
    this.setState({
      openEdit: false,
    });
  }

  render() {
    return (
      <>
        <Card className={globalStyles.modalCard}>
          <CardContent>
            <div className={styles.modalContainer}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  {this.props.department ? (
                    <Typography
                      sx={{
                        fontSize: 14,
                        paddingTop: 2,
                        textAlign: "left",
                      }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {this.props.department.name}
                    </Typography>
                  ) : null}
                  <Typography
                    sx={{
                      fontSize: 14,
                      paddingTop: 2,
                      textAlign: "left",
                    }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {this.props.metric.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <MetricAValue metric={this.props.metric} />
                  {/*this.props.metric.getValueGrow() > 0 ? (
                      <div className={styles.variationUp}>
                        <ArrowDropUpIcon /> {this.props.metric.getValueGrow()}
                      </div>
                    ) : (
                      <div className={styles.variationDown}>
                        <ArrowDropDownIcon /> {this.props.metric.getValueGrow()}
                      </div>
                    )*/}
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography sx={{ textAlign: "left" }}>Owner</Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ textAlign: "right" }}>
                    {this.props.metric.owner.email}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "left" }}>
                    Threshold Good
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "right" }}>
                    {this.props.metric.goodThreshold}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "left" }}>
                    Threshold Bad
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "right" }}>
                    {this.props.metric.badThreshold}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "left" }}>
                    Last Updated
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: "right" }}>
                    {" "}
                    {this.props.metric.updateDateTime}
                  </Typography>
                </Grid>
              </Grid>
              {this.props.metric.description}
            </div>
          </CardContent>
          <CardActions className={globalStyles.cardActions}>
            <div className={styles.actionButtons}>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <Link to="/home/graphs">
                <IconButton aria-label="share">
                  <QueryStatsIcon />
                </IconButton>
              </Link>
            </div>
          </CardActions>
        </Card>
      </>
    );
  }
}
