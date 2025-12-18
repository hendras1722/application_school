import { joinURL, withQuery } from 'ufo';
import {
  setRequestHeader,
  getCookie,
  getQuery,
  getRouterParam,
  proxyRequest,
} from 'h3'

export default defineEventHandler(async (event) => {
  // const requestedWith = getRequestHeader(event, 'x-requested-with');

  // if (requestedWith !== 'XMLHttpRequest') {
  //   throw createError({
  //     statusCode: 403,
  //     message: 'Forbidden Access',
  //   })
  // }

  // const config = useRuntimeConfig();
  const apiBaseUrl = 'https://auth.syahendra.com/v1';
  const token      = getCookie(event, 'token');
  const path       = getRouterParam(event, 'path') ?? '';

  const headers = {
    ...getRequestHeaders(event), // forward header asli
    ...(token && { authorization: `Bearer ${token}` }),
  }

  const queryParam = getQuery(event);
  return await proxyRequest(event, withQuery(joinURL(apiBaseUrl, path), queryParam), {
    headers
  });
});
