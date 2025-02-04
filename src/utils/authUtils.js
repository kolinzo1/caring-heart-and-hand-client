export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;

  const decodedToken = parseJwt(token);
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

export const getTokenExpirationTime = (token) => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) return null;
  return decodedToken.exp * 1000; // Convert to milliseconds
};

export const getRoleFromToken = (token) => {
  const decodedToken = parseJwt(token);
  return decodedToken?.role || null;
};
