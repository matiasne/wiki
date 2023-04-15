import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import globalStyles from "../../../global.module.css";
import { UtilsContext } from "../../../layout/utils.context";
import ConfirmationDialog from "../../../shared/ConfirmationDialog";
import InvitationsList from "../../invitations/InvitationsList";
import MetricDialogForm from "../../metrics/components/MetricADialogEdit";
import MetricsAList from "../../metrics/components/MetricsAList";
import { MetricA } from "../../metrics/models/metric";
import UserRolesList from "../../users/components/UserRolesList";
import { Department } from "../models/department";
import {
  default as DepartmentService,
  default as departmentsService,
} from "../services/departments.service";
import styles from "./departmentCard.module.css";

type DepartmentEditProps = {
  departmentId: string;
  navigation: any;
  onSave: (department: Department) => void;
};

type DepartmentEditState = {
  currentDepartment: Department;
  metrics: MetricA[];
  allDepartments: any[];
  title: string;
  formValid: boolean;
  formSubmitted: boolean;
  isEditing: boolean;
  openAddMetric: boolean;
  error: {
    parentId: string;
    name?: string;
    badThreshold?: string;
    goodThreshold?: string;
    thresholdGreen?: string;
  };
  openDeleteConfirmation: boolean;
};

class DepartmentForm extends React.Component<
  DepartmentEditProps,
  DepartmentEditState
> {
  static contextType = UtilsContext;

  constructor(props: any) {
    super(props);
    this.state = {
      metrics: [],
      allDepartments: [],
      currentDepartment: new Department(),
      title: "New Metric",
      formValid: false,
      formSubmitted: false,
      isEditing: false,
      openAddMetric: false,
      error: {
        parentId: "",
        name: "",
        badThreshold: "",
        goodThreshold: "",
        thresholdGreen: "",
      },
      openDeleteConfirmation: false,
    };
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    this.refresh();
  }

  async refresh() {
    console.log("refreshing");
    let allDepartments: any[] = await departmentsService.getAll();

    if (!this.state.currentDepartment.id) {
      if (this.props.departmentId) {
        (this.context as any).showLoader();

        console.log(this.props.departmentId);

        let editDepartment = await departmentsService.getById(
          this.props.departmentId
        );
        (this.context as any).hideLoader();

        if (editDepartment) {
          this.setState({
            metrics: editDepartment.metrics,
            currentDepartment: editDepartment,
            title: "Edit Department",
            isEditing: true,
          });
        }
      } else {
      }
    } else {
      let editDepartment = await departmentsService.getById(
        this.state.currentDepartment.id
      );

      console.log("editDepartment", editDepartment);

      this.setState({
        metrics: editDepartment.metrics,
        currentDepartment: editDepartment,
        title: "Edit Department",
        isEditing: true,
      });
    }

    this.setState({
      allDepartments: allDepartments,
    });
    (this.context as any).hideLoader();
  }

  public async save() {
    if (!this.state.isEditing) {
      let data = await departmentsService.createNew(
        this.state.currentDepartment.name,
        this.state.currentDepartment.parentId
          ? this.state.currentDepartment.parentId
          : "0"
      );

      let newDepartment = new Department();
      newDepartment.id = data.id;
      newDepartment.name = data.name;
      newDepartment.parentId = data.parentId;

      this.setState({
        currentDepartment: newDepartment,
        isEditing: true,
      });
    } else {
      await departmentsService.update(this.state.currentDepartment);
    }

    this.setState({
      isEditing: true,
    });
  }

  public async delete() {
    const { navigation } = this.props;

    await DepartmentService.delete(this.state.currentDepartment.id);
    navigation("/home/my-department");
  }

  handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name: string = target.name;

    let updatedDepartment: any = this.state.currentDepartment;

    updatedDepartment[name] = value;

    this.errorsValidations();

    this.setState({
      currentDepartment: updatedDepartment,
    } as Pick<any, keyof any>);
  }

  errorsValidations() {
    this.setState({
      formValid: true,
    });

    let errors = {
      parentId: "",
      name: "",
      badThreshold: "",
      goodThreshold: "",
      thresholdGreen: "",
    };

    if (!this.state.currentDepartment.parentId) {
      errors.name = "Please select a Department";
      this.setState({
        formValid: false,
        error: errors,
      });
    } else {
      errors.parentId = "";
    }

    if (!this.state.currentDepartment.name) {
      errors.name = "Please enter a name";
      this.setState({
        formValid: false,
        error: errors,
      });
    } else {
      errors.name = "";
    }

    if (!this.state.currentDepartment.badThreshold) {
      errors.badThreshold = "Please enter a velue";
      this.setState({
        formValid: false,
        error: errors,
      });
    } else {
      errors.badThreshold = "";
    }
  }

  public handleOpenAddMetric = () => {
    this.setState({
      openAddMetric: true,
    });
  };

  public handleCloseAddMetric = () => {
    this.setState({
      openAddMetric: false,
    });
  };

  openConfirmationDialog = () => {
    this.setState({
      openDeleteConfirmation: true,
    });
  };

  render() {
    return (
      <>
        <Card className={globalStyles.objectCard}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {this.state.allDepartments.length > 0 ? (
                  <FormControl
                    fullWidth
                    size="small"
                    className={styles.formControl}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Parent Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Department"
                      name="parentId"
                      value={this.state.currentDepartment.parentId}
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
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={styles.formControl}
                  label="Department Name"
                  type="text"
                  name="name"
                  size="small"
                  value={this.state.currentDepartment.name}
                  onChange={this.handleInputChange}
                  error={
                    this.state.error.name != "" && this.state.formSubmitted
                  }
                  helperText={this.state.error.name}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await this.save();
                  }}
                >
                  Save
                </Button>
              </Grid>

              <Grid item xs={12}>
                {this.state.isEditing ? (
                  <MetricsAList
                    department={this.state.currentDepartment}
                    showConfig={true}
                    onChange={() => {
                      this.refresh();
                    }}
                  />
                ) : null}
                {this.state.isEditing ? (
                  <Button onClick={this.handleOpenAddMetric}>New Metric</Button>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                {this.state.isEditing ? (
                  <>
                    <UserRolesList
                      onChange={() => {
                        this.refresh();
                      }}
                      userRoles={this.state.currentDepartment.usersRoles}
                    />
                  </>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                {this.state.isEditing ? (
                  <>
                    <InvitationsList
                      departmentId={this.state.currentDepartment.id}
                    />
                  </>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                {this.state.isEditing ? (
                  <>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={this.openConfirmationDialog}
                    >
                      Delete
                    </Button>
                    <ConfirmationDialog
                      open={this.state.openDeleteConfirmation}
                      onClose={() => {
                        this.setState({
                          openDeleteConfirmation: false,
                        });
                      }}
                      message={"Are you sure to delete this department?"}
                      onAccept={() => {
                        this.setState({
                          openDeleteConfirmation: false,
                        });
                        this.delete();
                      }}
                    />
                  </>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <MetricDialogForm
          department={this.state.currentDepartment}
          show={this.state.openAddMetric}
          onClose={() => {
            this.handleCloseAddMetric();
            this.refresh();
          }}
          onSave={() => {
            this.handleCloseAddMetric();
            this.refresh();
          }}
          onDelete={() => {
            this.handleCloseAddMetric();
            this.refresh();
          }}
        />
      </>
    );
  }
}

export default function (props: any) {
  const navigation = useNavigate();

  return <DepartmentForm {...props} navigation={navigation} />;
}
