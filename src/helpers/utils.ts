import moment from 'moment';

const { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

const accessTokenCookieOptions = {
  expires: moment().add(ACCESS_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(ACCESS_TOKEN_EXPIRES_IN!) * 60 * 1000,
  httpOnly: true,
  secure: false, //HTTPS için burayı true yap. Eğer ki localhostta çalışıyorsan burayı false yap.
  sameSite: 'lax' as const, //localhost için none yerine lax daha güvenli. HTTPS için none yap.
  path: '/' /*
  !path Fastify'da çok önemli yazılmazsa cookie gönderilmez. Mesela burada / yazdık çünkü bu cookie nin tüm site için geçerli olmasını istedik. Ama istersek bunu /todos yapıp sadece todos için geçerli kılabiliriz.
  */,
};

const refreshTokenCookieOptions = {
  expires: moment().add(REFRESH_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(REFRESH_TOKEN_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false, //HTTPS için burayı true yap. Eğer ki localhostta çalışıyorsan burayı false yap.
  sameSite: 'lax' as const, //localhost için none yerine lax daha güvenli. HTTPS için none yap.
  path: '/' /*
  !path Fastify'da çok önemli yazılmazsa cookie gönderilmez. Mesela burada / yazdık çünkü bu cookie nin tüm site için geçerli olmasını istedik. Ama istersek bunu /todos yapıp sadece todos için geçerli kılabiliriz.
  */,
};

export { accessTokenCookieOptions, refreshTokenCookieOptions };
