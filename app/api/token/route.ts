import { client } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side endpoint to exchange an authorization code for an access token
 * The reason we do this server-side is to keep the client secret safe
 */
export const POST = async (request: NextRequest) => {
  const { code, codeVerifier, state } = await request.json();

  client.settings.authenticationMethod = "client_secret_post";
  client.settings.clientSecret = process.env.VANA_CLIENT_SECRET as string;
  const { accessToken, expiresAt, refreshToken } =
    await client.authorizationCode.getToken({
      code,
      state,
      codeVerifier,
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
    });

  return NextResponse.json({ accessToken, expiresAt, refreshToken });
};
