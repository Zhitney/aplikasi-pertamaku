# Dockerfile for Frontend
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install --global pnpm
RUN pnpm install

# Copy the rest of the frontend files
COPY . ./

# Build the frontend
RUN pnpm run build

# Stage 2: Serve the static files using nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
