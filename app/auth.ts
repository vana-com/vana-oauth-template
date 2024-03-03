import { OAuth2Client } from "@badgateway/oauth2-client";

// This OAuth client is used both in the client and server side
export const client = new OAuth2Client({
  server: process.env.NEXT_PUBLIC_VANA_OAUTH_URL,
  clientId: process.env.NEXT_PUBLIC_VANA_CLIENT_ID as string,
  tokenEndpoint: "/oauth2/token",
  authorizationEndpoint: "/oauth2/auth",
  discoveryEndpoint: "/.well-known/openid-configuration",
});
