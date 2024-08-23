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
  const [validationMessage, setValidationMessage] = useState<string>("");

  const validateLogin = (e: any): void => {
    try {
      validateNewUser({ id: loginId, password: loginPassword });
    } catch (err: any) {
      e.preventDefault();
      setValidationMessage(err.message);
    }
  };

  return (
    <BlankLayout>
      {message && <p>{message}</p>}
      {validationMessage && <p>{validationMessage}</p>}
      <b>Login</b>
      <br />
      <br />
      <Form
        method="POST"
        action="/login"
        onSubmit={(e): void => validateLogin(e)}
        style={{ marginBottom: "1em" }}
      >
        <input type="hidden" name="goto" value={goto || "news"} />
        <table style={{ border: "0px" }}>
          <tbody>
            <tr>
              <td>username:</td>
              <td>
                <input
                  autoCapitalize="off"
                  autoCorrect="off"
                  name="id"
                  minLength={USERID_MIN_LENGTH}
                  maxLength={USERID_MAX_LENGTH}
                  onChange={(e: any): void => setLoginId(e.target.value)}
                  size={20}
                  spellCheck={false}
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>password:</td>
              <td>
                <input
                  type="password"
                  name="password"
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  onChange={(e: any): void => setLoginPassword(e.target.value)}
                  size={20}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input type="submit" value="login" />
      </Form>
      <a href="/forgot">Forgot your password?</a>
    </BlankLayout>
  );
}

export default LoginPage;
