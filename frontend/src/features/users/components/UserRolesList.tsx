import React from "react";
import { UserRolItem } from "./UserRolItem";

type UserRolesListProps = {
  userRoles: any[];
  onChange: () => void;
};

export default class UserRolesList extends React.Component<UserRolesListProps> {
  constructor(props: any) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <>
        {this.props.userRoles.map((userRol: any, i) => {
          return (
            <UserRolItem
              key={i}
              userRol={userRol}
              updated={() => {
                this.props.onChange();
              }}
            />
          );
        })}
      </>
    );
  }
}
