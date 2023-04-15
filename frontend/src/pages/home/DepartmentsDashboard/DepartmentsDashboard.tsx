import AddIcon from "@mui/icons-material/Add";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import React from "react";
import { Link } from "react-router-dom";
import DepartmentCard from "../../../features/departments/components/DepartmentCard";
import { Department } from "../../../features/departments/models/department";
import departmentsService from "../../../features/departments/services/departments.service";
import globalStyles from "../../../global.module.css";
import { UtilsContext } from "../../../layout/utils.context";
import styles from "./departments.module.css";

type DepartmentState = {
  department: any;
  allDepartments: Department[];
  loading: boolean;
};

class DepartmentsDashboard extends React.Component<{}, DepartmentState> {
  static contextType = UtilsContext;

  constructor(props: any) {
    super(props);
    this.state = {
      department: new Department(),
      allDepartments: [],
      loading: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    this.refresh();
  }

  async refresh() {
    (this.context as any).showLoader();
    this.setState({ loading: true });
    let allDepartments: any[] = await departmentsService.getAll();

    if (allDepartments.length > 0) {
      let d = await departmentsService.getById(allDepartments[0].id);

      this.setState({
        allDepartments: allDepartments,
        department: d,
        loading: false,
      });
    }
    (this.context as any).hideLoader();
  }

  async handleInputChange(event: any) {
    this.setState({ loading: true });
    let d = await departmentsService.getById(event.target.value);

    setTimeout(() => {
      this.setState({
        department: d,
        loading: false,
      });
    }, 300);
  }

  render() {
    return (
      <div className={globalStyles.pageBackground}>
        <div className={globalStyles.pageContainer}>
          <FormControl fullWidth className={styles.formSelect}>
            <InputLabel id="demo-simple-select-label">Department</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Department"
              onChange={this.handleInputChange}
            >
              {this.state.allDepartments.map((d, i) => {
                return (
                  <MenuItem key={i} value={d.id}>
                    {d.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
        </div>
        <div className={globalStyles.fabStyle}>
          <Link to={"/home/editDepartment"}>
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Link>
        </div>
      </div>
    );
  }
}

export default DepartmentsDashboard;
