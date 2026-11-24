"use client";

import SignInForm from "./sign-in-form";
import ImageCarousel from "./image-carousel";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/30 p-4 sm:p-6 lg:p-8 gap-6">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-3xl min-h-[600px]">
        <ImageCarousel />
      </div>
    </div>
  );
}
