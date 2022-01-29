import SpotifyWebAPI from "spotify-web-api-node";
import getConfig from "next/config";
import crypto from "crypto";

const scopes = getConfig().serverRuntimeConfig.SPOTIFY_SCOPE.split(" ");

// const toUnixTimestamp = (date: Date): string =>
//   String(Math.floor(date.getTime() / 1000));

export class SpotifyClient {
  private client: SpotifyWebAPI;

  constructor() {
    this.client = new SpotifyWebAPI({
      clientId: getConfig().serverRuntimeConfig.SPOTIFY_CLIENT_ID,
      clientSecret: getConfig().serverRuntimeConfig.SPOTIFY_CLIENT_SECRET,
      redirectUri: getConfig().serverRuntimeConfig.SPOTIFY_REDIRECT_URI,
    });
  }

  public getAuthorizeUrl(): string {
    const state = crypto.randomBytes(8).toString("hex");
    const showLoginDialog =
      getConfig().serverRuntimeConfig.SPOTIFY_SHOW_LOGIN_DIALOG;
    return this.client.createAuthorizeURL(scopes, state, showLoginDialog);
  }

  public async authorize(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    const { body } = await this.client.authorizationCodeGrant(code);
    return {
      accessToken: body.access_token,
      expiresAt: new Date(Date.now() + body.expires_in * 1000),
      refreshToken: body.refresh_token,
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<string> {
    this.client.setRefreshToken(refreshToken);
    const { body } = await this.client.refreshAccessToken();
    return body.access_token;
  }

  public async getUser(
    accessToken: string
  ): Promise<SpotifyApi.CurrentUsersProfileResponse> {
    this.client.setAccessToken(accessToken);
    const { body } = await this.client.getMe();
    return body;
  }

  public async getRecentlyPlayed(
    accessToken: string
    // after?: Date
  ): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> {
    this.client.setAccessToken(accessToken);
    const { body } = await this.client.getMyRecentlyPlayedTracks({
      // TODO: fix being able to query for recently songs after a point in time
      // after: after ? toUnixTimestamp(after) : undefined,
      limit: 50,
    });
    return body;
  }
}

export default new SpotifyClient();
