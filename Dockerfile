# Use the official Ubuntu 22.04 as the base image (once available)
FROM ubuntu:22.04

# Update the package list and install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    git \
    vim \
    nodejs \
    npm \
    cmake

# Install NVM
RUN curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh \
    && bash install_nvm.sh \
    && echo 'source $HOME/.nvm/nvm.sh' >> $HOME/.bashrc

# Set up a working directory as /home/fuzz
WORKDIR /home/fuzz

# Add your application files to the container (if needed)
COPY rce.js /home/fuzz/pp.js

# Expose any ports your application may use (if needed)
# EXPOSE 80

# Start your application (if needed)
# CMD [ "node", "app.js" ]

# Source NVM and install Node.js LTS using bash
RUN /bin/bash -c "source $HOME/.nvm/nvm.sh && nvm install --lts"
