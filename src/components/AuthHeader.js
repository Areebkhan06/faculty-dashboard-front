"use client";

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function AuthHeader() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // wait until Clerk is ready

  return (
    <div className="flex items-center gap-4">
      {!isSignedIn && (
        <>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
              Log in
            </button>
          </SignInButton>
        </>
      )}

      {isSignedIn && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-gray-700">Session Active</span>
            <span className="text-[11px] text-green-500 font-semibold tracking-wide">● Online</span>
          </div>

          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
}