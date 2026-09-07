"use server";

import { APIError } from "better-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { auth } from "../auth";
import type { LoginValues, SignUpValues } from "../validations";
import { loginSchema, signUpSchema } from "../validations";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { email, name, phoneNumber, password } =
      signUpSchema.parse(credentials);
    auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        phoneNumber: Number(phoneNumber),
      },
    });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof APIError) return { error: error.message };
    return { error: "Something went wrong. Please try again later." };
  }
}
export async function login(
  credentials: LoginValues
): Promise<{ error: string }> {
  try {
    const { email, password } = loginSchema.parse(credentials);

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: "Something went wrong. Please try again later." };
  }
}
