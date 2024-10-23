# Dockerfile for Frontend
FROM node:22

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY frontend/package*.json ./

RUN npm install 

# Copy the rest of the frontend files
COPY frontend/ .

EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
