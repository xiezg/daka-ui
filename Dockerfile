from node:18.16.0-alpine3.17 as builder
WORKDIR /data
RUN --mount=type=bind,source=./,target=/data,readwrite  npm rum build

from nginx:alpine3.17
COPY --from=builder /root/dist/ /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/ca /etc/nginx/ca/

