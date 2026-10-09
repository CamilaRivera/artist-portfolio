server {
    server_name flaviacanepa.cl;

    location / {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
    }

    listen [::]:443 ssl http2; # managed by Certbot
    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/flaviacanepa.cl/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/flaviacanepa.cl/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = flaviacanepa.cl) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name flaviacanepa.cl;
    listen       80;
    listen       [::]:80;
    return 404; # managed by Certbot
}
