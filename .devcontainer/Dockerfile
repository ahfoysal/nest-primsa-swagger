# Use Node.js 22-slim image (ARM and x86 compatible)
FROM node:22-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    procps \
    git \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Copy prisma folder (for client generation)
COPY prisma ./prisma

# Install Node.js dependencies
# --ignore-scripts prevents pre/post install scripts from running too early
RUN npm install --ignore-scripts

# Generate Prisma client for Linux
RUN npx prisma generate

# Copy the rest of the source code
COPY . ./

# Build the NestJS app
RUN npm run build

# Create volume for uploads
VOLUME ["/app/uploads"]

# Expose NestJS port
EXPOSE 5005

# Default command for development
# Use start:dev with polling for reliable file watching on macOS mounted volumes
CMD ["npm", "run", "start:dev"]
