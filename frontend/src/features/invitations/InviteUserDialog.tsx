import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { UtilsContext } from "../../layout/utils.context";
import { Rol } from "../users/models/user";
import { SendInvitation } from "./models/invitation";
import invitationsService from "./services/invitations.service";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid #eee",
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { m: 1 },
};

type InviteUserDialogProps = {
  show: boolean;
  departmentId: string;
  onClose: () => void;
  onSend: () => void;
};

type InviteUserDialogState = {
  title: string;
  formValid: boolean;
  formSubmitted: boolean;
  error: string;
  form: {
    email: string;
    rol: string;
  };
  allRoles: string[];
};

export default class InviteUserDialog extends React.Component<
  InviteUserDialogProps,
  InviteUserDialogState
> {
  static contextType = UtilsContext;

  state = {
    title: "Send Invite",
    formValid: false,
    formSubmitted: false,
    error: "",
    form: {
      email: "",
      rol: "",
    },
    allRoles: [Rol.COOWNER, Rol.VIEWER],
  };

  constructor(props: any) {
    super(props);
    this.send = this.send.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
  }

  componentDidMount() {}

  public async send() {
    this.setState({
      formSubmitted: true,
    });
    if (this.isValid()) {
      let invitation: SendInvitation = {
        userReceivingEmail: this.state.form.email,
        rol: this.state.form.rol,
        departmentId: this.props.departmentId,
      };
      await invitationsService.sendInvitation(invitation);
      (this.context as any).showToast("Invitation Sent", "success");
      this.setState({
        formValid: false,
        formSubmitted: false,
        form: {
          email: "",
          rol: "",
        },
      });
      this.props.onSend();
    }
  }

  handleInputChange(event: any) {
    this.setState({
      formValid: false,
      error: "",
    });
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name: string = target.name;

    let newFormValues: any = this.state.form;
    newFormValues[name] = value;

    this.setState({
      form: newFormValues,
    } as Pick<any, keyof any>);
  }

  isValid() {
    let errors = {
      email: "",
    };

    if (!this.isValidEmail()) {
      this.setState({
        error: "Please enter a valid email",
      });
      return false;
    } else {
      errors.email = "";
      return true;
    }
  }

  isValidEmail() {
    return /\S+@\S+\.\S+/.test(this.state.form.email);
  }

  render() {
    return (
      <>
        <Dialog
          open={this.props.show}
          onClose={this.props.onClose}
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent>
            <TextField
              label="User email"
              type="email"
              size="small"
              name="email"
              value={this.state.form.email}
              onChange={this.handleInputChange}
              error={this.state.error != "" && this.state.formSubmitted}
              helperText={this.state.error}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Rol</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Rol"
                name="rol"
                value={this.state.form.rol}
                onChange={this.handleInputChange}
              >
                {this.state.allRoles.map((d, i) => {
                  return (
                    <MenuItem key={i} value={d}>
                      {d}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button onClick={this.send}>Send</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
