export interface UserDto {
  username: string;
  password: string;
  roles?: string[];
}

export interface AccessToken {
  access_token: string;
}
