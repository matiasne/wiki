import { useState } from "react";
import FirstStage from "./stages/FirstStage";
import SecondStage from "./stages/SecondStage";
import ThirdStage from "./stages/ThirdStage";

export interface StagesProps {
  setStage: (value: number) => void;
  email: string;
  setEmail: (value: string) => void;
}

function ForgotPassword() {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <>
      {stage === 1 ? (
        <FirstStage setStage={setStage} email={email} setEmail={setEmail} />
      ) : stage === 2 ? (
        <SecondStage setStage={setStage} email={email} setEmail={setEmail} />
      ) : (
        <ThirdStage />
      )}
    </>
  );
}

export default ForgotPassword;
