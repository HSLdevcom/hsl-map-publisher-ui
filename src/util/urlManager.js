import { createBrowserHistory as createHistory } from 'history';

const history = createHistory();

function removeAuthParams() {
  const shareUrl = window.location.href;
  const url = new URL(shareUrl);
  url.searchParams.delete('code');
  url.searchParams.delete('scope');
  history.replace({ pathname: url.pathname, search: url.search });
}

function getAuthParams() {}

export { removeAuthParams, getAuthParams };
