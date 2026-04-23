NGINX_PROXY=nginxreverseproxy

up:
	docker compose up -d --build
	docker cp nginx-proxy.conf $(NGINX_PROXY):/etc/nginx/conf.d/techradarui.conf
	docker exec $(NGINX_PROXY) nginx -s reload

down:
	docker compose down
