import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SpeedIcon from "@mui/icons-material/Speed";
import ViewListIcon from "@mui/icons-material/ViewList";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type NavBottomProps = {
  children?: React.ReactNode;
};

type NavBottomState = {
  selected: any;
  anchorElNav: any;
  anchorElUser: any;
};

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default class NavBottom extends React.Component<
  NavBottomProps,
  NavBottomState
> {
  constructor(props: any) {
    super(props);
    this.state = { selected: 0, anchorElUser: "", anchorElNav: "" };
  }

  setearEstado(newValue: any) {
    this.setState({
      selected: newValue,
    });
  }

  handleOpenUserMenu() {}

  handleCloseUserMenu() {}

  handleOpenNavMenu() {}

  handleCloseNavMenu() {}

  render() {
    return (
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={this.state.selected}
          onChange={(event, newValue) => {
            this.setearEstado(newValue);
          }}
        >
          <Link
            to="/home/my-department"
            onClick={() => {
              this.setearEstado(1);
            }}
          >
            <BottomNavigationAction label="My Department" icon={<HomeIcon />} />
          </Link>

          <Link to="/home/departments">
            <BottomNavigationAction label="Speed" icon={<SpeedIcon />} />
          </Link>
          <Link to="/home/graphs">
            <BottomNavigationAction
              label="Favorites"
              icon={<QueryStatsIcon />}
            />
          </Link>
          <Link to="/home/metrics">
            <BottomNavigationAction label="Nearby" icon={<ViewListIcon />} />
          </Link>
        </BottomNavigation>
      </Paper>
    );
  }
}
