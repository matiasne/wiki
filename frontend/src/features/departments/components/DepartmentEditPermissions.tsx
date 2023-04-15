import { useUserAuth } from "../../../AuthContext";
import { Department } from "../models/department";

export interface DepartmentEditPermissionProps {
  department: Department;
  children: any;
}

export const DepartmentEditPermission = ({
  department,
  children,
}: DepartmentEditPermissionProps) => {
  const getUser = useUserAuth();

  if (department.userCanEdit(getUser())) {
    return children; // rendering nested elements
  } else {
    return null;
  }
};
