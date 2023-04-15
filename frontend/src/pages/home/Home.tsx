import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../layout/NavBar";
import NavBottom from "../../layout/NavBottom";

export default class Home extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <NavBar />
        <Outlet />
        <NavBottom />
      </>
    );
  }
}
