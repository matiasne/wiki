import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import FormLogin from "./FormLogin";

function Login() {
  const auth = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <FormLogin />
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="pb-8">
            <h3 className="mx-auto mt-6 text-center text-3xl font-sans">OR</h3>
          </div>
          <div>
            <Link to={"/signUp"}>
              <Button type="submit" variant="contained" fullWidth>
                {" "}
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
