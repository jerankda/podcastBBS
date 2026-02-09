# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Firebase Config für Build (öffentliche Keys, kein Sicherheitsrisiko)
ENV VITE_FIREBASE_API_KEY=AIzaSyDVGAaNVpNtE03ffpq1ckL9QL0XkMNtXWg
ENV VITE_FIREBASE_AUTH_DOMAIN=podcaster-c417b.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID=podcaster-c417b
ENV VITE_FIREBASE_STORAGE_BUCKET=podcaster-c417b.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=638450889366
ENV VITE_FIREBASE_APP_ID=1:638450889366:web:a30ddf324f19e9940848b7

# API URL - wird beim Build eingebunden
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built frontend and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/ecosystem.config.cjs ./

# Create directories for uploads and data
RUN mkdir -p /app/server/uploads/audio /app/server/uploads/images /app/server/data

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app/server

EXPOSE 3001

CMD ["node", "index.js"]
