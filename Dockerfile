# Use the specialized Next.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Enable pnpm pre and post scripts
RUN pnpm config set enable-pre-post-scripts true

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./


# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN pnpm build

# Set environment variables
ENV PORT=3000

# Expose the port the app runs on
EXPOSE $PORT

# Start the Next.js application
CMD ["pnpm", "start"]
