FROM node:20-slim

ENV HAMH_STORAGE_LOCATION="/data"
VOLUME /data

RUN mkdir /install
COPY package.tgz /install/app.tgz
RUN npm install -g /install/app.tgz
COPY patches /patches
RUN rm -rf /install
RUN apt update && apt install -y patch
RUN for patch in /patches/*.patch; do \
    package=$(basename "$patch" .patch | sed 's/__/\//'); \
    cd "/usr/local/lib/node_modules/home-assistant-matter-hub/node_modules/$package" && \
    patch -p1 < "$patch"; \
    done

CMD exec home-assistant-matter-hub start
