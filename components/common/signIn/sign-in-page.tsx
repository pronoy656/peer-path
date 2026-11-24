"use client";

import AuthSplitLayout from "./auth-split-layout";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignInForm />
    </AuthSplitLayout>
  );
}
