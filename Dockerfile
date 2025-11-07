FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built application and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "build"]