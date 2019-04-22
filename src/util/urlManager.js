import {createBrowserHistory as createHistory} from "history";

let history = createHistory();

function removeAuthParams() {
  let shareUrl = window.location.href;
  const url = new URL(shareUrl);
  url.searchParams.delete("code");
  url.searchParams.delete("scope");
  history.replace({pathname: "/", search: url.search});
}

export {
  removeAuthParams,
};
