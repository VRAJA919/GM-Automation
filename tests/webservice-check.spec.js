// Utility for token retrieval only. No Playwright test() calls here.

const defaultTokenVersion = 'v3'; // Can be changed to v4, v4.1, v5

function getTokenUrl(stack, tokenVersion) {
  return `${stack.url}/${tokenVersion}/tokens`;
}


async function getToken(request, env) {
  let stack;
  if (env === 'GQ1') {
    stack = {
      name: 'GQ1',
      url: 'https://gq1.road.com/wsapi',
      username: 'testwsapi40693',
      password: 'Trimble@123',
    };
  } else if (env === 'Staging') {
    stack = {
      name: 'Staging',
      url: 'https://eu-staging.road.com/wsapi',
      username: 'testwsapi34608',
      password: 'testwsapi34608',
    };
  } else if (env === 'PROD') {
    stack = {
      name: 'PROD',
      url: 'https://eugm.road.com/wsapi',
      username: 'testvijay',
      password: 'Trimble@123',
    };
  } else {
    throw new Error('Unknown environment: ' + env);
  }
  const tokenVersion = process.env.TOKEN_VERSION || 'v4';
  const tokenUrl = getTokenUrl(stack, tokenVersion);
  const body = {
    identity: {
      username: stack.username,
      password: stack.password,
    },
  };
  const response = await request.post(tokenUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: body,
  });
  if (!response.ok()) throw new Error(`Token request failed for ${env}`);
  const tokenJson = await response.json();
  if (!tokenJson.token?.bearer) throw new Error(`No bearer token for ${env}`);
  return tokenJson.token.bearer;
}
module.exports = { getToken };
