# Stage 1: Install shared dependencies
FROM node:18-alpine AS dependencies
WORKDIR /

# Copy root-level package.json and package-lock.json
COPY ./package.json ./package-lock.json ./

# Install shared dependencies (production-only for smaller image size)
RUN npm install --legacy-peer-deps

# Stage 2: Build the service
FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared dependencies from the previous stage
COPY --from=dependencies ./node_modules ./node_modules

# Copy service-specific files (e.g., from apps/gateway)
COPY . .

# Build the service
RUN npm run build

# Stage 3: Prepare the final image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only the built files and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the service's port if needed for debugging or HTTP
EXPOSE 3000

# Copy the .env file to the image (if required, adjust location as needed)
COPY .env .env

# Set the default command
CMD ["node", "./dist/apps/gateway/main.js"]


