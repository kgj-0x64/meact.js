import { USERID_MAX_LENGTH, USERID_MIN_LENGTH } from "../config.js";

export enum UserLoginErrorCode {
  MISSING_CREDENTIALS = "missing-cred",
  INCORRECT_PASSWORD = "pw",
  INVALID_ID = "invalid_id",
  REGISTRATION_PENDING = "reg-pending",
  LOGGED_IN = "loggedin",
  LOGIN_UNSUCCESSFUL = "unsuccessful",
  LOGIN_PROFILE = "update-profile",
  LOGIN_UPVOTE = "up",
  USERNAME_TAKEN = "id-taken",
  SUBMIT = "submit",
}

const userLoginErrorCodeMessages: Record<UserLoginErrorCode, string> = {
  [UserLoginErrorCode.MISSING_CREDENTIALS]: "Missing credentials",
  [UserLoginErrorCode.INCORRECT_PASSWORD]: "Incorrect password.",
  [UserLoginErrorCode.INVALID_ID]: `User ID must be between ${USERID_MIN_LENGTH} and ${USERID_MAX_LENGTH} characters.`,
  [UserLoginErrorCode.REGISTRATION_PENDING]: `User with this ID does not exist. You must register for HackerNews clone separately for login to work`,
  [UserLoginErrorCode.LOGGED_IN]:
    "Logged in user must logout before logging in again.",
  [UserLoginErrorCode.LOGIN_UNSUCCESSFUL]: "Login unsuccessful.",
  [UserLoginErrorCode.LOGIN_PROFILE]:
    "You have to be logged in to update your profile.",
  [UserLoginErrorCode.LOGIN_UPVOTE]: "You have to be logged in to vote.",
  [UserLoginErrorCode.USERNAME_TAKEN]: "Username is taken.",
  [UserLoginErrorCode.SUBMIT]: "You have to be logged in to submit.",
};

export function getErrorMessageForLoginErrorCode(
  code: UserLoginErrorCode
): string {
  return userLoginErrorCodeMessages[code];
}
