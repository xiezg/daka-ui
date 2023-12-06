from node:18.17 as builder
WORKDIR /data
RUN --mount=type=bind,source=./,target=/data,readwrite make

from nginx:alpine3.17
COPY --from=builder /root/dist/ /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/ca /etc/nginx/ca/

