# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=18-bullseye@sha256:86b5bc74be785e3905b154dc5916f2d0021dae3e8a5adc03276cf7a46ff70cd2
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

ARG WATCHEXEC_VERSION=1.20.5

# RUN cd /tmp \ 
#     && wget https://github.com/watchexec/watchexec/releases/download/cli-v${WATCHEXEC_VERSION}/watchexec-${WATCHEXEC_VERSION}-x86_64-unknown-linux-gnu.deb \
#     && sudo dpkg -i watchexec-${WATCHEXEC_VERSION}-x86_64-unknown-linux-gnu.deb \
#     && cd -

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    # && apt-get -y install --no-install-recommends watchexec

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
