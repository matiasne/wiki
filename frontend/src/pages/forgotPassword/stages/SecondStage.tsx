import axios from "axios";
import { useState } from "react";
import { StagesProps } from "..";
import ErrorMessage from "../../../common/ErrorMessage";
import { BaseURL } from "../../../common/util/baseURL";

function SecondStage(props: StagesProps) {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const submitResetPassword = async (event: any) => {
    event.preventDefault();
    setError(false);
    if (password !== confirmPassword) {
      setErrorMessage("Both Passwords have to be the same.");
      setError(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/auth/resetPassword`, {
        email: props.email,
        password: password,
        code: verificationCode,
      });
      props.setStage(3);
    } catch (error) {
      setErrorMessage("Failed to reset Password. Check verification code");
      setError(true);
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
            RESET YOUR PASSWORD
          </h2>
          <h3 className="mt-2 text-center text-xl font-sans">
            Insert your the verification code that was sent to your email and
            the new password.
          </h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitResetPassword}>
          {error ? <ErrorMessage message={errorMessage} /> : null}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="verificationCode"
                name="verificationCode"
                type="string"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-4 border-gray-400 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#d48e3c] focus:border-[#d48e3c] focus:z-10 sm:text-sm disabled:border-gray-400 disabled:bg-gray-400"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-4 border-gray-400 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#d48e3c] focus:border-[#d48e3c] focus:z-10 sm:text-sm disabled:border-gray-400 disabled:bg-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-4 border-gray-400 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#d48e3c] focus:border-[#d48e3c] focus:z-10 sm:text-sm disabled:border-gray-400 disabled:bg-gray-400"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#dc9f61] hover:bg-[#d48e3c]"
              disabled={loading}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SecondStage;
