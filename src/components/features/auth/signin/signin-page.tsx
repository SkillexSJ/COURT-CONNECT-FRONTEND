"use client";

import { SignInForm } from "./signin-form";
import { AuthSplitLayout } from "../shared/auth-split-layout";

export function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignInForm />
    </AuthSplitLayout>
  );
}

export default SignInPage;
