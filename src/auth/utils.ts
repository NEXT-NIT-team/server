import { Tokens } from 'app-request';
import { AuthFailureError, InternalError } from '../core/Error';
import JWT, { JwtPayload } from '../core/JWT';
import { Types } from 'mongoose';
import User from '../database/model/User';
import { TOKEN_INFO } from '../config';
import i18next from 'i18next';

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== TOKEN_INFO.issuer ||
    payload.aud !== TOKEN_INFO.audience ||
    !Types.ObjectId.isValid(payload.sub)
  )
    throw new AuthFailureError(i18next.t("invalidAccessToken"));
  return true;
};

export const createTokens = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      TOKEN_INFO.issuer,
      TOKEN_INFO.audience,
      user._id.toString(),
      accessTokenKey,
      TOKEN_INFO.accessTokenValidityDays,
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      TOKEN_INFO.issuer,
      TOKEN_INFO.audience,
      user._id.toString(),
      refreshTokenKey,
      TOKEN_INFO.refreshTokenValidityDays,
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};
