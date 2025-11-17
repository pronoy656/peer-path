"use client";

// import { useState, useEffect } from "react";
import SignInForm from "./sign-in-form";
import ImageCarousel from "./image-carousel";

export default function SignInPage() {
  //   const [isMounted, setIsMounted] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden p-8">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center border border-yellow-400 m-6 rounded-3xl">
        <div className="w-full max-w-xl">
          <SignInForm />
        </div>
      </div>

      {/* Right Side - Image Carousel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden rounded-3xl m-6">
        <ImageCarousel />
      </div>
    </div>
  );
}
