# STEP 1: Base image (Node.js 22 LTS)
FROM node:22-alpine

# STEP 2: Set working directory inside container
WORKDIR /usr/src/app

# STEP 3: Copy dependency files (for better caching)
COPY package*.json ./

# STEP 4: Install only production dependencies
RUN npm install --production

# STEP 5: Copy all other files from your project
COPY . .

# STEP 6: Set environment to production
ENV NODE_ENV=production

# STEP 7: Expose the app’s port (Azure will map to it)
EXPOSE 8080

# STEP 8: Start the app
CMD ["npm", "start"]
