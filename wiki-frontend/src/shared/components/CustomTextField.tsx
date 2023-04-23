import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";

export const CustomTextField = styled(MuiTextField)((props) => ({
  width: "100%",
  height: "56px",
  background: "#F4F7FF",
  borderRadius: "8px",
  ".MuiFormLabel-root": {
    fontFamily: "var(--font-family-primary)",
    fontStyle: "var(--font-style-primary)",
    fontWeight: "var(--font-weight-1)",
    fontSize: "var(--font-size-4)",
    lineHeight: "var(--line-height-4)",
    letterSpacing: "var(--letter-spacing-1)",
    color: "var(--medium-grey)",
    marginTop: "3px",
  },

  ".MuiInputBase-root": {
    fontFamily: "var(--font-family-primary)",
    fontStyle: "var(--font-style-primary)",
    fontWeight: "var(--font-weight-1)",
    fontSize: "var(--font-size-4)",
    lineHeight: "var(--line-height-1)",
    letterSpacing: "var(--letter-spacing-2)",
    color: "var(--black)",
  },

  ".MuiOutlinedInput-notchedOutline": {
    borderWidth: "0px",
  },
}));
