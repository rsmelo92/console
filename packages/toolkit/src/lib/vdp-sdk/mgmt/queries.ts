import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { ApiToken, User } from "./types";

export type GetUserMeResponse = {
  user: User;
};

export async function getUserMeQuery({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUserMeResponse>("/users/me");

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserResponse = {
  user: User;
};

export async function getUserQuery({
  userName,
  accessToken,
}: {
  userName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUserResponse>(`/${userName}`);

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetApiTokenResponse = {
  token: ApiToken;
};

export async function getApiTokenQuery({
  tokenName,
  accessToken,
}: {
  tokenName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetApiTokenResponse>(`/${tokenName}`);

    return Promise.resolve(data.token);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ListApiTokensResponse = {
  tokens: ApiToken[];
  next_page_token: string;
  total_size: string;
};

export type ListUsersResponse = {
  users: User[];
  next_page_token: string;
  total_size: string;
};

export async function listApiTokensQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");
    const tokens: ApiToken[] = [];

    const queryString = getQueryString({
      baseURL: "/tokens",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListApiTokensResponse>(queryString);

    tokens.push(...data.tokens);

    if (data.next_page_token) {
      tokens.push(
        ...(await listApiTokensQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(tokens);
  } catch (err) {
    return Promise.reject(err);
  }
}
export async function listUsersQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");
    const users: User[] = [];

    const queryString = getQueryString({
      baseURL: "/users",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListUsersResponse>(queryString);

    users.push(...data.users);

    if (data.next_page_token) {
      users.push(
        ...(await listUsersQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(users);
  } catch (err) {
    return Promise.reject(err);
  }
}
