import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "This email is already in use",
  "auth/configuration-not-found":
    "Firebase Authentication is not configured for this project",
  "auth/invalid-credential": "Email or password is invalid",
  "auth/invalid-api-key": "The Firebase API key is invalid",
  "auth/invalid-email": "Email is invalid",
  "auth/network-request-failed":
    "Unable to reach Firebase. Check your connection and try again",
  "auth/operation-not-allowed":
    "Email and password sign-in is not enabled in Firebase",
  "auth/unauthorized-domain":
    "This preview domain is not authorized in Firebase Authentication",
  "auth/weak-password": "Password must be at least 6 characters",
};

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Authentication failed";
  }

  return "Something went wrong. Please try again.";
}
