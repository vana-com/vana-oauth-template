"use client";

import { generateCodeVerifier } from "@badgateway/oauth2-client";
import { client } from "./auth";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "./components/LoadingIndicator";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accountUsername, setAccountUsername] = useState<string | null>(null);

  /**
   * Begin the authorization code flow by redirecting the user to the Vana login page
   * Once the user accepts the login request, they will be redirected back to /auth to continue with the token exchange
   */
  const login = async () => {
    const oauthState = Math.random().toString(36);
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem("codeVerifier", codeVerifier);
    localStorage.setItem("state", oauthState);
    document.location = await client.authorizationCode.getAuthorizeUri({
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
      state: oauthState,
      codeVerifier,
      scope: ["openid", "offline"],
    });
  };

  /**
   * Log the user out by clearing the access token from local storage
   * Does not revoke any existing access tokens
   */
  const logout = async () => {
    localStorage.clear();
    setAccessToken(null);
  };

  /**
   * Retrieve the saved access token from local storage
   * @returns The access token if it exists and is not expired, otherwise null
   */
  const getAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = new Date(
      +(localStorage.getItem("accessTokenExpiresAt") || "")
    );
    if (accessToken && expiresAt > new Date()) {
      return accessToken;
    }

    logout();
    return null;
  };

  /**
   * On page load, check if the user is already logged in
   */
  useEffect(() => {
    const cachedAccessToken = getAccessToken();
    if (cachedAccessToken) {
      setAccessToken(cachedAccessToken);

      /**
       * If the user is logged in, get their account details from the Vana API
       */
      const getVanaAccount = async () => {
        if (accessToken) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_VANA_API_URL}/api/v0/account`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const { account } = await response.json();
            localStorage.setItem("accountId", account.id);
            setAccountUsername(account.username);
          } else if (response.status === 401) {
            console.warn("Access token invalid, logging out");
            logout();
          } else {
            console.error(
              "Failed to get Vana account",
              response.status,
              response.statusText
            );
          }
        }
      };
      getVanaAccount();
    }
  }, [accessToken]);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        {/* Not logged in, show login button*/}
        {!accessToken && (
          <button
            className="px-4 py-3 rounded-md text-white outline"
            onClick={() => login()}
          >
            Login with Vana
          </button>
        )}

        {/* Logged in, show user details + logout button */}
        {accessToken && (
          <div className="flex flex-col space-y-4">
            {!accountUsername && <LoadingIndicator />}
            {accountUsername && (
              <p>
                Logged in as <b>{accountUsername}</b>
              </p>
            )}
            <button
              className="px-4 py-3 rounded-md text-white outline"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
