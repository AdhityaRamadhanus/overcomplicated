FROM node:8.4.0

# will be run with context of outer folder
# Copy the local package files to the container's workspace.
ADD ./auth /overcomplicated/auth
ADD ./models /overcomplicated/models

WORKDIR /overcomplicated/auth

RUN npm install

# Run the outyet command by default when the container starts.
ENTRYPOINT ["node", "server.js"]

# Expose ports.
EXPOSE 8000
