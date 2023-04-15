import BaseCRUD from "../../../common/baseCRUD";

class UserDepartmentRolService extends BaseCRUD {
  constructor() {
    super("/user-department-rol");
  }
}

export default new UserDepartmentRolService();
