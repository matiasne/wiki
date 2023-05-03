import {
  useUpdateAuth,
  useUserAuth,
} from "@/features/auth/contexts/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type HomeProps = {
  children?: React.ReactNode;
  updateAuth: any;
  navigation: any;
  user: any;
};

type HomeState = {
  anchorEl: any;
};

const pages: any[] = [];
const settings: any[] = [];

class NavBar extends React.Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props);
    this.state = { anchorEl: null };
    this.handleLogout = this.handleLogout.bind(this);
    console.log(this.props.user);
  }

  setearEstado(newValue: any) {}

  handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleNotification = () => {};

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleLogout() {
    const { navigation } = this.props;
    const { updateAuth } = this.props;

    updateAuth(false);
    navigation("/login");
    this.handleClose();
  }

  render() {
    return (
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar>
            <div>
              <Link href="/home/notifications">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={this.handleNotification}
                  color="inherit"
                >
                  <NotificationsNoneIcon />
                </IconButton>
              </Link>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export default function (props: any) {
  const updateAuth = useUpdateAuth();
  const navigation = useRouter();
  const getUser = useUserAuth();

  return (
    <NavBar
      {...props}
      user={getUser()}
      updateAuth={updateAuth}
      navigation={navigation}
    />
  );
}
