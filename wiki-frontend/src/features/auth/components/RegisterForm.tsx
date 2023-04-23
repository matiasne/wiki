"use client";

import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import style from "./auth.module.css";
import { BaseURL } from "@/config/variables";
import { CustomTextField } from "@/shared/components/CustomTextField";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { useUpdateAuth } from "@/features/auth/contexts/AuthContext";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const router = useRouter();
  const updateAuth = useUpdateAuth();
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("inviteId");

  const submitSignUp = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      let resp = await axios.post(`${BaseURL}/auth/register`, {
        username: name,
        email: email,
        password: password,
        inviteId: inviteId ? parseInt(inviteId) : null,
      });
      console.log(resp.status == 200);
      setOpenToast(true);
      submitLogin(event);
      //navigate("/");
    } catch (error: any) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

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
        localStorage.setItem("token", response.data.idToken.jwtToken);
        updateAuth(true);
        setTimeout(() => {
          window.location.href = "/home/my-department";
        }, 1000);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(error.response.data.message);
      if (error.response.data.message == "User is not confirmed.") {
        router.push("/verificationCode?email=" + email);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <div>
          <h1>Create A New Account</h1>
        </div>
        <form onSubmit={submitSignUp}>
          {error ? <ErrorMessage message={error} /> : null}

          <div className={style.spaceformItems}>
            <CustomTextField
              id="fullName"
              label="Full Name"
              type="text"
              name="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={style.spaceformItems}>
            <CustomTextField
              id="email-address"
              label="Email"
              type="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={style.spaceformItems}>
            <CustomTextField
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <p className={style.spaceformItems}>
            Password must have{" "}
            <span className={style.greenSpan}>10 characters</span>,{" "}
            <span className={style.greenSpan}>numbers</span>,{" "}
            <span className={style.redSpan}>uppercase</span> &{" "}
            <span className={style.redSpan}>special characters</span>
          </p>
          <div className={style.spaceformItems}>
            <PrimaryButton type="submit" disabled={loading}>
              Sign Up
            </PrimaryButton>
          </div>
          <div className={style.spaceformItems}>
            <h5>
              Already have an account? <Link href={"/login"}>Log In</Link>
            </h5>
          </div>
        </form>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openToast}
        autoHideDuration={6000}
      >
        <Alert severity={"success"} sx={{ width: "100%" }}>
          'Successfully Registered'
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;
