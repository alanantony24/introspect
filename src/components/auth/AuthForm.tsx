"use client";

import Link from "next/link";
import { useActionState } from "react";

import { buttonStyles } from "@/lib/design";
import {
  type AuthActionState,
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/supabase/actions";

type AuthFormProps = {
  mode: "login" | "signup";
};

const initialState: AuthActionState = {};

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const action = isLogin ? signInWithPassword : signUpWithPassword;
  const [state, formAction, pending] = useActionState(action, initialState);
  const emailId = `${mode}-email`;
  const passwordId = `${mode}-password`;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor={emailId}
          className="text-sm font-medium text-stone-700"
        >
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="introspect-field px-4 py-3 text-sm"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor={passwordId}
          className="text-sm font-medium text-stone-700"
        >
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          className="introspect-field px-4 py-3 text-sm"
          placeholder="Enter your password"
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`${buttonStyles.primary} w-full`}
      >
        {pending
          ? isLogin
            ? "Signing in..."
            : "Creating account..."
          : isLogin
            ? "Sign in"
            : "Create account"}
      </button>

      <p className="text-center text-sm text-stone-500">
        {isLogin ? "New to Introspect?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:text-stone-950"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
