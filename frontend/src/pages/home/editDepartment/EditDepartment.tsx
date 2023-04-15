import React from "react";
import { useParams } from "react-router-dom";
import DepartmentForm from "../../../features/departments/components/DepartmentForm";
import { Department } from "../../../features/departments/models/department";
import globalStyles from "../../../global.module.css";
import NavBar from "../../../layout/NavBar";

class EditDepartment extends React.Component<{ departmentId: string }, {}> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {}

  saveDepartment(department: Department): void {}

  render() {
    return (
      <div>
        <NavBar />
        <div className={globalStyles.pageContainer}>
          <DepartmentForm
            onSave={(department: any) => {
              this.saveDepartment(department);
            }}
            departmentId={this.props.departmentId}
          />
        </div>
      </div>
    );
  }
}

export default function (props: any) {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { departmentId } = useParams();

  return <EditDepartment {...props} departmentId={departmentId} />;
}
