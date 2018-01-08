// @flow

import {OK, handleError} from '../util/error-util';

export async function deleteResource(
  urlSuffix: string
): Promise<void> {
  const url = getUrlPrefix() + urlSuffix;
  const options = {method: 'DELETE'};
  const res = await fetch(url, options);
  if (!res.ok) {
    return handleError(res.statusText);
  }
}

export async function getJson(urlSuffix: string): Promise<mixed> {
  const url = getUrlPrefix() + urlSuffix;
  const options = {method: 'GET'};
  const res = await fetch(url, options);
  if (res.status !== OK) {
    return handleError(res.statusText);
  }

  const json = await res.json();
  return json;
}

// This function will contain more logic
// when we are ready for production deployment.
export function getUrlPrefix() {
  return 'http://localhost:3001/';
}

export async function patchJson(
  urlSuffix: string,
  bodyObj: Object
): Promise<Object> {
  const url = getUrlPrefix() + urlSuffix;
  const options = {
    method: 'PATCH',
    body: JSON.stringify(bodyObj),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const res = await fetch(url, options);
  if (!res.ok) handleError(res.statusText);
  return res;
}

export async function postJson(
  urlSuffix: string,
  bodyObj: Object
): Promise<Object> {
  const url = getUrlPrefix() + urlSuffix;
  const options = {
    method: 'POST',
    body: JSON.stringify(bodyObj),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const res = await fetch(url, options);
  if (!res.ok) handleError(res.statusText);
  return res;
}
