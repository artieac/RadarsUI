@echo off
set NGINX_PROXY=nginxreverseproxy-app-1

if "%1"=="down" (
    docker compose down
) else (
    docker compose up -d --build
    docker cp nginx-proxy.conf %NGINX_PROXY%:/etc/nginx/conf.d/techradarui.conf
    docker exec %NGINX_PROXY% nginx -s reload
)
