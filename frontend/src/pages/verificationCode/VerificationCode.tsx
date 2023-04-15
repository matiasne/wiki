import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../common/ErrorMessage";
import authService from "../../features/auth/auth.service";

export default function VerificationCode() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitCode = async (event: any) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    authService.confirmEmailCode(username, code).then((data: any) => {
      if (data.code == "ERR_BAD_REQUEST") {
        setError(data.response.data.message);
      } else {
        navigate("/login");
      }
    });

    // navigate("/login");
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
            <form className="mt-8 space-y-6" onSubmit={submitCode}>
              {error ? <ErrorMessage message={error} /> : null}

              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <TextField
                    id="username"
                    label="Email"
                    type="text"
                    size="small"
                    name="email"
                    value={username}
                    onChange={(e: any) => setUsername(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>

              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <TextField
                    id="verification-code"
                    label="Code"
                    type="text"
                    size="small"
                    name="email"
                    value={code}
                    onChange={(e: any) => setCode(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
              <div>
                <Button type="submit" variant="contained" fullWidth>
                  {" "}
                  Verify Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
