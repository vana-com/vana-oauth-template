"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Auth({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const router = useRouter();

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

  useEffect(() => {
    exchangeCodeForToken(searchParams.code);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <LoadingIndicator />
      </div>
    </div>
  );
}

const LoadingIndicator = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "auto",
      background: "none",
      display: "block",
      shapeRendering: "auto",
    }}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="#3498db"
      strokeWidth="4"
      strokeDasharray="31.415, 31.415"
      strokeLinecap="round"
      style={{
        transformOrigin: "center",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
    </style>
  </svg>
);
