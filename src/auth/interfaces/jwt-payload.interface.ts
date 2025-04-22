export interface JwtPayload {
  /**
   * Subject (user ID)
   */
  sub: number;

  /**
   * User's email address
   */
  email: string;

  password: string;

  /**
   * User's roles with organization context
   */
  roles: {
    role: string;
    organizationId?: number;
  }[];

  /**
   * Issued at (timestamp when the token was created)
   */
  iat?: number;

  /**
   * Expiration time (timestamp when the token expires)
   */
  exp?: number;
}
