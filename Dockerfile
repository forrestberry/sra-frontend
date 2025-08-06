# Use a lightweight Nginx image to serve our static files
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy our frontend code into the container
COPY . .

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint script to run when the container starts
ENTRYPOINT ["/docker-entrypoint.sh"]

# The command that the entrypoint script will execute after it's done
# This starts Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
