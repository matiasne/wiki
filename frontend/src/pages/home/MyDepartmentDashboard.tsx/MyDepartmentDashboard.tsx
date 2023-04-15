import { Button, Grid, Paper, Slide } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DepartmentCard from "../../../features/departments/components/DepartmentCard";
import { Department } from "../../../features/departments/models/department";
import departmentsService from "../../../features/departments/services/departments.service";
import { User } from "../../../features/users/models/user";
import usersService from "../../../features/users/services/users.service";
import globalStyles from "../../../global.module.css";
import { UtilsContext } from "../../../layout/utils.context";

type MyDepartmentState = {
  department?: Department;
  loading: boolean;
};

export default class MyDepartmentsDashboard extends React.Component<
  {},
  MyDepartmentState
> {
  static contextType = UtilsContext;

  value: any;

  constructor(props: any) {
    super(props);
    this.state = {
      department: undefined,
      loading: true,
    };
  }

  async componentDidMount(): Promise<void> {
    (this.context as any).showLoader();

    await this.refresh();
    (this.context as any).hideLoader();
  }

  async refresh() {
    let user: User = await usersService.getMy();

    if (user.getFirstDepartmentOwnerId()) {
      let d = await departmentsService.getById(
        user.getFirstDepartmentOwnerId()
      );
      this.setState({ department: d, loading: false });
    }
  }

  render() {
    return (
      <div className={globalStyles.pageBackground}>
        <div className={globalStyles.pageContainer}>
          {this.state.department ? (
            <Slide
              direction="up"
              in={!this.state.loading}
              mountOnEnter
              unmountOnExit
            >
              <Paper sx={{ m: 1 }} elevation={0}>
                <DepartmentCard departmentId={this.state.department.id} />
              </Paper>
            </Slide>
          ) : (
            <>
              {!this.state.loading ? (
                <>
                  You don't have any department assigned, please create a new
                  one or check your invitations.
                  <Grid item xs={12}>
                    <Link to={"/home/notifications"}>
                      <Button variant="text">Notifications</Button>
                    </Link>
                    <Link to={"/home/editDepartment"}>
                      <Button variant="contained">New Department</Button>
                    </Link>
                  </Grid>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  }
}
