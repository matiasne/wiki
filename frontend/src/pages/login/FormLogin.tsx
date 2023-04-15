import { Button, TextField } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpdateAuth } from "../../AuthContext";
import ErrorMessage from "../../common/ErrorMessage";
import { BaseURL } from "../../common/util/baseURL";

function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateAuth = useUpdateAuth();

  const submitLogin = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/auth/login`, {
        username: email,
        password: password,
      });

      if (response.data.idToken) {
        Cookies.set("email", email);
        localStorage.setItem("token", response.data.idToken.jwtToken);
        updateAuth(true);
        window.location.href = "/home/my-department";
      } else {
        setError("Email/Password combination is not correct.");
      }
    } catch (error: any) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center pt-12 pb-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-24 w-auto"
            src="/boc-orange.png"
            alt="boc logo"
          />
          <h2 className="mt-6 text-center text-3xl font-sans">
            LOGIN TO YOUR ACCOUNT
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitLogin}>
          {error ? <ErrorMessage message={error} /> : null}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <TextField
                id="email-address"
                label="Email"
                type="text"
                size="small"
                name="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                disabled={loading}
                fullWidth
              />
            </div>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <TextField
              id="password"
              label="Password"
              type="password"
              size="small"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              fullWidth
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to={"/forgotPassword"}>
                <p className="font-medium"> Forgot your password? </p>
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" variant="contained" fullWidth>
              {" "}
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormLogin;
