import axios from "axios";
import { useState } from "react";
import { StagesProps } from "..";
import ErrorMessage from "../../../common/ErrorMessage";
import { BaseURL } from "../../../common/util/baseURL";

function FirstStage(props: StagesProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submitEmail = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BaseURL}/auth/verify-email`, { email: props.email });
      props.setStage(2);
    } catch (error) {
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
            RECOVER YOUR PASSWORD
          </h2>
          <h3 className="mt-2 text-center text-xl font-sans">
            Insert your account email bellow.
          </h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitEmail}>
          {error ? (
            <ErrorMessage message="Failed to send verification code." />
          ) : null}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-4 border-gray-400 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#d48e3c] focus:border-[#d48e3c] focus:z-10 sm:text-sm disabled:border-gray-400 disabled:bg-gray-400"
                placeholder="Email address"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
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
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-700 group-hover:text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Send Verification Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FirstStage;
