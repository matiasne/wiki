"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import style from "./auth.module.css";
import { useUpdateAuth } from "../contexts/AuthContext";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { BaseURL } from "@/config/variables";
import { CustomTextField } from "@/shared/components/CustomTextField";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { OutlinedButton } from "@/shared/components/OutlinedButton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updateAuth = useUpdateAuth();
  const router = useRouter();

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
          router.push("/home");
        }, 1000);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      if (error.response.data.message == "User is not confirmed.") {
        router.push("/verificationCode?email=" + email);
      }
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <img className={style.logo} src="/boc-orange.png" alt="boc logo" />
        <h1>Login To Your Account</h1>
      </div>
      <form onSubmit={submitLogin}>
        {error ? <ErrorMessage message={error} /> : null}

        <div className={style.spaceformItems}>
          <CustomTextField
            id="email-address"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={style.spaceformItems}>
          <Link className={style.link} href="/forgotPassword">
            <h5> Forgot your password? </h5>
          </Link>
        </div>

        <div className={style.spaceformItems}>
          <PrimaryButton type="submit"> Sign in</PrimaryButton>
        </div>
      </form>
      <div>
        <div>
          <h6>
            <span>or</span>
          </h6>
        </div>
        <div>
          <Link href={"/register"}>
            <OutlinedButton type="submit"> Register</OutlinedButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
