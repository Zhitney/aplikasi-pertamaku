# Dockerfile for Backend
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY backend/package.json ./
COPY backend/pnpm-lock.yaml ./
RUN npm install --global pnpm
RUN pnpm install

# Copy the rest of the backend files
COPY backend/ ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
