export const REFRESH_TOKEN_COOKIE = 'uai_refresh_token';
export const ROLES_KEY = 'roles';

export const jwtSecret =
  process.env.JWT_SECRET ?? 'uai-quartos-dev-secret-change-in-production';

export const jwtAccessTtlSeconds = Number(
  process.env.JWT_ACCESS_TTL_SECONDS ?? 900,
);

export const refreshTokenDays = Number(process.env.JWT_REFRESH_DAYS ?? 7);
