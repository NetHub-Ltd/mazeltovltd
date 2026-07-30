// src/lib/auth-errors.ts
import { CredentialsSignin } from "@auth/core/errors"; // For Auth.js v5 beta

/**
 * Custom error class for Credentials provider.
 * When thrown in the `authorize` function, its `code` property will be
 * propagated to `signIn` response's `code` field on the client-side
 * when `redirect: false` is used.
 */
export class CustomError extends CredentialsSignin {
  // The 'code' property is what we'll use to carry our custom message.
  // The 'error' property on the client-side `signIn` result will likely still be "CredentialsSignin".
  code: string;

  constructor(message: string, cause?: Error) {
    // Call the parent constructor. The first argument can be a generic name or identifier.
    // The 'cause' property is for the underlying error.
    super("custom_credentials_error", { cause }); // A generic name for the CredentialsSignin type
    this.code = message; // Store the custom message in the 'code' property
    Object.setPrototypeOf(this, CustomError.prototype); // Essential for instanceof checks
  }
}
