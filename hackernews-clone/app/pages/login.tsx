import { JSX } from "@meact/jsx-runtime";
import { useSearchParams } from "../custom-hooks/useSearchParams.js";
import { URLSearchParamFields } from "../utils/http-handlers.js";
import {
  getErrorMessageForLoginErrorCode,
  UserLoginErrorCode,
} from "../utils/user-login-error-code.js";
import { useState } from "@meact";
import { BlankLayout } from "../layouts/blank-layout.js";
import { Form } from "../components/Form.js";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERID_MAX_LENGTH,
  USERID_MIN_LENGTH,
} from "../config.js";
import { validateNewUser } from "../utils/validation/user.js";

function LoginPage(): JSX.Element {
  const searchParams = useSearchParams();
  const how = searchParams.get(URLSearchParamFields.HOW) as
    | UserLoginErrorCode
    | undefined;
  const goto = searchParams.get(URLSearchParamFields.GOTO);

  const message = how ? getErrorMessageForLoginErrorCode(how) : undefined;

  const [loginId, setLoginId] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerId, setRegisterId] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string>("");

  const validateLogin = (e: any): void => {
    try {
      validateNewUser({ id: loginId, password: loginPassword });
    } catch (err: any) {
      e.preventDefault();
      setValidationMessage(err.message);
    }
  };

  const validateRegister = (e: any): void => {
    try {
      validateNewUser({ id: registerId, password: registerPassword });
    } catch (err: any) {
      e.preventDefault();
      setValidationMessage(err.message);
    }
  };

  return (
    <BlankLayout>
      {message ? <p>{`Request failure reason: ${message}`}</p> : <null />}
      {validationMessage ? (
        <p>{`Invalid data: ${validationMessage}`}</p>
      ) : (
        <null />
      )}
      <b>Login</b>
      <br />
      <br />
      <Form
        method="POST"
        action="/login"
        onSubmit={(e): void => validateLogin(e)}
        style={formStyle}
      >
        <input name="goto" type="hidden" prop:value={goto || "/"} />
        <table style={formTableStyle}>
          <tbody>
            <tr>
              <td>username:</td>
              <td>
                <input
                  name="id"
                  type="text"
                  size={20}
                  autoComplete="on"
                  autoCapitalize="off"
                  spellCheck={false}
                  minLength={USERID_MIN_LENGTH}
                  maxLength={USERID_MAX_LENGTH}
                  prop:value={loginId}
                  prop:onChange={(e: any): void => setLoginId(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>password:</td>
              <td>
                <input
                  name="password"
                  type="password"
                  size={20}
                  autoComplete="on"
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  prop:value={loginPassword}
                  prop:onChange={(e: any): void =>
                    setLoginPassword(e.target.value)
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input type="submit" prop:value="login" />
      </Form>
      <br />
      <br />
      <b>Create Account</b>
      <br />
      <br />
      <Form
        method="POST"
        action={`/register?goto=${goto}`}
        onSubmit={(e): void => validateRegister(e)}
        style={formStyle}
      >
        <table style={formTableStyle}>
          <tbody>
            <tr>
              <td>username:</td>
              <td>
                <input
                  name="id"
                  type="text"
                  size={20}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  minLength={USERID_MIN_LENGTH}
                  maxLength={USERID_MAX_LENGTH}
                  prop:value={registerId}
                  prop:onChange={(e: any): void =>
                    setRegisterId(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>password:</td>
              <td>
                <input
                  name="password"
                  type="password"
                  size={20}
                  autoComplete="off"
                  autoCapitalize="off"
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  prop:value={registerPassword}
                  prop:onChange={(e: any): void =>
                    setRegisterPassword(e.target.value)
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input type="submit" prop:value="create account" />
      </Form>
    </BlankLayout>
  );
}

const formStyle = { marginBottom: "1em" };
const formTableStyle = { border: "0px" };

export default LoginPage;
