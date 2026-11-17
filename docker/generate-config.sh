#!/bin/sh
# Runs from the nginx image's /docker-entrypoint.d/ at container start and writes the
# SPA's runtime config (window.PublisherUiConfig, read by src/config.js).
#   APP_ENV=dev|prod  loads the REACT_APP_* values of the baked-in .env.<APP_ENV>
#   REACT_APP_*       env vars override single values
# Keys left unset fall back to the build-time values (.env.prod).
set -eu

HTML_DIR=${HTML_DIR:-/usr/share/nginx/html}
ENV_DIR=${ENV_DIR:-/etc/publisher-ui}
KEYS="REACT_APP_API_URL REACT_APP_JORE_API_URL REACT_APP_CLIENT_ID REACT_APP_REDIRECT_URI REACT_APP_LOGIN_PROVIDER_URI REACT_APP_NAMESPACE"

envfile=""
if [ -n "${APP_ENV:-}" ]; then
	envfile="$ENV_DIR/.env.$APP_ENV"
	if [ ! -f "$envfile" ]; then
		echo "generate-config: unknown APP_ENV '$APP_ENV' (no $envfile)" >&2
		exit 1
	fi
fi

out="$HTML_DIR/config.js"
tmp="$out.tmp"
{
	echo "window.PublisherUiConfig = {"
	for key in $KEYS; do
		eval "value=\${$key:-}"
		if [ -z "$value" ] && [ -n "$envfile" ]; then
			value=$(sed -n "s/^$key=//p" "$envfile" | tail -n 1 | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/")
		fi
		if [ -n "$value" ]; then
			escaped=$(printf '%s' "$value" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')
			printf '  "%s": "%s",\n' "$key" "$escaped"
		fi
	done
	echo "};"
} >"$tmp"
mv "$tmp" "$out"
echo "generate-config: wrote $out (APP_ENV=${APP_ENV:-<unset>})"
