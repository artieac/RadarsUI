# ── shared dependency install ─────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# ── dev build ─────────────────────────────────────────────────────────────────
FROM deps AS builder-dev

ARG REACT_APP_TECHNOLOGY_SITE_URL=https://local.technologyradar.alwaysmoveforward.com:8082
ARG REACT_APP_TECHNOLOGY_API_URL=http://api.local.technologyradar.alwaysmoveforward.com:8081
ARG REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL=http://manage.local.technologyradar.alwaysmoveforward.com:8082
ARG REACT_APP_TECHNOLOGY_ADMIN_URL=http://admin.local.technologyradar.alwaysmoveforward.com:8082

RUN printf "REACT_APP_TECHNOLOGY_SITE_URL=%s\n\
REACT_APP_TECHNOLOGY_API_URL=%s\n\
REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL=%s\n\
REACT_APP_TECHNOLOGY_ADMIN_URL=%s\n" \
  "$REACT_APP_TECHNOLOGY_SITE_URL" \
  "$REACT_APP_TECHNOLOGY_API_URL" \
  "$REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL" \
  "$REACT_APP_TECHNOLOGY_ADMIN_URL" > .env

RUN npm run build

# ── prod build ────────────────────────────────────────────────────────────────
FROM deps AS builder-prod

ARG REACT_APP_TECHNOLOGY_SITE_URL=https://technologyradar.alwaysmoveforward.com
ARG REACT_APP_TECHNOLOGY_API_URL=https://api.technologyradar.alwaysmoveforward.com
ARG REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL=https://manage.technologyradar.alwaysmoveforward.com
ARG REACT_APP_TECHNOLOGY_ADMIN_URL=https://admin.technologyradar.alwaysmoveforward.com

RUN printf "REACT_APP_TECHNOLOGY_SITE_URL=%s\n\
REACT_APP_TECHNOLOGY_API_URL=%s\n\
REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL=%s\n\
REACT_APP_TECHNOLOGY_ADMIN_URL=%s\n" \
  "$REACT_APP_TECHNOLOGY_SITE_URL" \
  "$REACT_APP_TECHNOLOGY_API_URL" \
  "$REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL" \
  "$REACT_APP_TECHNOLOGY_ADMIN_URL" > .env

RUN npm run build-prod

# ── dev serve ─────────────────────────────────────────────────────────────────
FROM nginx:alpine AS dev
COPY --from=builder-dev /app/src/static /usr/share/nginx/html
COPY --from=builder-dev /app/target/classes/static/script/dist /usr/share/nginx/html/script/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ── prod serve ────────────────────────────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=builder-prod /app/src/static /usr/share/nginx/html
COPY --from=builder-prod /app/target/classes/static/script/dist /usr/share/nginx/html/script/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
