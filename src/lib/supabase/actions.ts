"use server";

import { redirect } from "next/navigation";

import { createClient } from "./server";

export type AuthActionState = {
  error?: string;
  message?: string;
};

function getCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || email.trim().length === 0) {
    return { error: "Enter an email address." };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter a password." };
  }

  return {
    email: email.trim(),
    password,
  };
}

export async function signInWithPassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const credentials = getCredentials(formData);

  if ("error" in credentials) {
    return { error: credentials.error };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in.",
    };
  }

  redirect("/dashboard");
}

export async function signUpWithPassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const credentials = getCredentials(formData);

  if ("error" in credentials) {
    return { error: credentials.error };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(credentials);

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account.",
    };
  }

  return {
    message:
      "Account created. Check your email if confirmation is enabled, then sign in.",
  };
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Sign-out should stay quiet if Supabase is not configured in development.
  }

  redirect("/dashboard");
}
