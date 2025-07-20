# --- Stage 1: Build the React application ---
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the React app for production
# Assuming your build command is 'npm run build'.
# Adjust if your package.json uses a different script (e.g., 'vite build' or 'react-scripts build')
# The output will typically be in a 'build' or 'dist' folder.
RUN npm run build

# --- Stage 2: Serve the React application with Nginx ---
FROM nginx:alpine

# Copy the built React app from the 'build' stage to Nginx's HTML directory
# Assuming your build output directory is 'dist'. Common alternatives are 'build'.
# Check your package.json's "build" script or the output of `npm run build`
# to confirm the exact directory name.
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration if you have one
# If you need specific Nginx settings (e.g., for routing or larger file sizes)
# you can create a 'nginx.conf' file in your project root and uncomment the line below.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which Nginx listens on by default
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]