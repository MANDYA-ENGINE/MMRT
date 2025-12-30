# Step 1: Use a tiny, professional web server (Nginx)
FROM nginx:alpine

# Step 2: Copy your website files into the server's "web" folder
COPY . /usr/share/nginx/html

# Step 3: Tell Docker to open port 80 so we can see the site
EXPOSE 80
