import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

export const PrimaryButton = styled(MuiButton)((props) => ({
  width: "100%",
  height: "56px",
  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
  background: "var(--linear-gradient-blue)",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "8px",
  textTransform: "capitalize",
  fontFamily: "var(--font-family-primary)",
  fontStyle: "var(--font-style-primary)",
  fontWeight: "var(--font-weight-2)",
  fontSize: "var(--font-size-4)",
  lineHeight: "var(--line-height-4)",
  letterSpacing: "var(--letter-spacing-1)",
  color: "var(--white)",
  textAlign: "center",
}));
