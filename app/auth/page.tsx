"use client";

import { useEffect } from "react";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useSearchParams, useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    /**
     * The user has been redirected back to /auth with an access code after accepting the login request in the Vana app
     * Exchange this access code for an access token by calling the /api/token endpoint
     */
    const exchangeCodeForToken = async (code: string) => {
      if (!code) return;
      const state = localStorage.getItem("state") as string;
      const codeVerifier = localStorage.getItem("codeVerifier") as string;

      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          state,
          codeVerifier,
        }),
      });

      if (response.ok) {
        // Successfully exchanged access code for access token, we're now logged in
        // Save it in localStorage and redirect back to the home page
        const { accessToken, expiresAt } = await response.json();
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("accessTokenExpiresAt", expiresAt);
        router.push("/");
      } else {
        console.error(
          "Failed to exchange access code for access token",
          response.status,
          response.statusText
        );
      }
    };

    const code = searchParams.get("code") as string;
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [searchParams, router]);
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <LoadingIndicator />
      </div>
    </div>
  );
}
