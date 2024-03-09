import SpotifyWebAPI from "spotify-web-api-node";
import getConfig from "next/config";
import crypto from "crypto";

const scopes = getConfig().serverRuntimeConfig.SPOTIFY_SCOPE.split(" ");

export class SpotifyClient {
  private client: SpotifyWebAPI;

  constructor() {
    this.client = new SpotifyWebAPI({
      clientId: getConfig().serverRuntimeConfig.SPOTIFY_CLIENT_ID,
      clientSecret: getConfig().serverRuntimeConfig.SPOTIFY_CLIENT_SECRET,
      // TODO: can avoid needing to use the full canonical URL here if I follow
      // this proxy advice: https://developer.spotify.com/documentation/web-playback-sdk/howtos/web-app-player#:~:text=Proxying%20Backend%20Requests
      redirectUri: getConfig().serverRuntimeConfig.SPOTIFY_REDIRECT_URI,
    });
  }

  public getAuthorizeUrl(): string {
    const state = crypto.randomBytes(16).toString("hex");
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
    accessToken: string,
    after?: Date
  ): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> {
    this.client.setAccessToken(accessToken);
    const { body } = await this.client.getMyRecentlyPlayedTracks({
      after: after ? after.getTime() : undefined,
      limit: 50,
    });
    return body;
  }
}

export default new SpotifyClient();
