import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../../common/ErrorMessage";
import { BaseURL } from "../../common/util/baseURL";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const search = useLocation().search;
  const inviteId = new URLSearchParams(search).get("invite");

  const submitSignUp = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BaseURL}/auth/register`, {
        username: name,
        email: email,
        password: password,
        inviteId: inviteId ? parseInt(inviteId) : null,
      });
      navigate("/");
    } catch (error: any) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center pt-12 pb-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-24 w-auto"
              src="/boc-orange.png"
              alt="boc logo"
            />
            <h2 className="mt-6 text-center text-3xl font-sans">
              CREATE A NEW ACCOUNT
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submitSignUp}>
            {error ? <ErrorMessage message={error} /> : null}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="fullName"
                  name="name"
                  type="string"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border-4 border-gray-400 placeholder-gray-500 text-gray-900 rounded-b-md rounded-t-md focus:outline-none focus:ring-[#d48e3c] focus:border-[#d48e3c] focus:z-10 sm:text-sm disabled:border-gray-400 disabled:bg-gray-400"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#dc9f61] hover:bg-[#d48e3c]"
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
