# Deployment Guide - xTraMarlin

## Production Deployment Options

### Option 1: Docker Compose (Recommended)

#### Prerequisites
- Docker & Docker Compose installed
- Domain name (optional)
- SSL certificate (recommended)

#### Steps

1. **Clone the repository**
```bash
git clone https://github.com/lesoxm/nowy-xtramarlin.git
cd nowy-xtramarlin
```

2. **Configure environment variables**
```bash
# Create production .env file for backend
cp backend/.env.example backend/.env
nano backend/.env
```

Set secure values:
```env
PORT=3001
JWT_SECRET=your-very-secure-random-string-here
NODE_ENV=production
```

3. **Build and start containers**
```bash
docker-compose up -d --build
```

4. **Verify deployment**
```bash
docker-compose ps
docker-compose logs
```

5. **Access the application**
- Frontend: http://your-domain:3000
- Backend API: http://your-domain:3001

#### Managing the deployment

**View logs:**
```bash
docker-compose logs -f
```

**Restart services:**
```bash
docker-compose restart
```

**Stop services:**
```bash
docker-compose down
```

**Update application:**
```bash
git pull
docker-compose down
docker-compose up -d --build
```

---

### Option 2: Traditional Server Deployment

#### Prerequisites
- Node.js 16+ installed
- Nginx installed
- PM2 for process management
- Domain name
- SSL certificate

#### Backend Deployment

1. **Install dependencies**
```bash
cd backend
npm install --production
```

2. **Configure environment**
```bash
cp .env.example .env
nano .env
```

3. **Install PM2**
```bash
npm install -g pm2
```

4. **Start backend with PM2**
```bash
pm2 start src/server.js --name xtramarlin-backend
pm2 save
pm2 startup
```

5. **Monitor backend**
```bash
pm2 status
pm2 logs xtramarlin-backend
```

#### Frontend Deployment

1. **Build frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/xtramarlin
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    root /path/to/nowy-xtramarlin/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://localhost:3001/uploads;
    }
}
```

3. **Enable site and restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/xtramarlin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 3: Cloud Platforms

#### Heroku

**Backend:**
```bash
cd backend
heroku create xtramarlin-backend
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
git push heroku main
```

**Frontend:**
```bash
cd frontend
heroku create xtramarlin-frontend
heroku buildpacks:set heroku/nodejs
git push heroku main
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select auto-deploy from main branch
3. Configure environment variables
4. Deploy

#### AWS (EC2 + RDS)

1. Launch EC2 instance (t2.medium recommended)
2. Set up RDS PostgreSQL database
3. Configure security groups
4. Deploy using PM2 + Nginx
5. Set up CloudFront for CDN

---

## Database Migration (SQLite to PostgreSQL)

For production, consider migrating to PostgreSQL:

1. **Install PostgreSQL client**
```bash
npm install pg pg-hstore
```

2. **Update database configuration**
```javascript
// backend/src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

3. **Run migrations**
Create SQL migration files based on the SQLite schema.

---

## SSL/TLS Configuration

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### Application Monitoring

**Install monitoring tools:**
```bash
npm install winston morgan
```

**Configure logging:**
```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### System Monitoring

**Use PM2 monitoring:**
```bash
pm2 monit
```

**Use external monitoring:**
- UptimeRobot
- New Relic
- Datadog
- Sentry for error tracking

---

## Backup Strategy

### Database Backup

**SQLite:**
```bash
# Backup
cp backend/database.sqlite backups/database-$(date +%Y%m%d).sqlite

# Restore
cp backups/database-20240101.sqlite backend/database.sqlite
```

**PostgreSQL:**
```bash
# Backup
pg_dump dbname > backups/backup-$(date +%Y%m%d).sql

# Restore
psql dbname < backups/backup-20240101.sql
```

### File Backup

**Backup uploaded photos:**
```bash
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz backend/uploads/
```

### Automated Backups

**Create backup script:**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/path/to/backups"

# Database backup
cp /path/to/database.sqlite $BACKUP_DIR/database-$DATE.sqlite

# Files backup
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz /path/to/uploads/

# Keep only last 30 days
find $BACKUP_DIR -name "*.sqlite" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

**Set up cron job:**
```bash
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Security Hardening

### Backend Security

1. **Rate limiting**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

2. **Helmet for security headers**
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **Input validation**
```bash
npm install express-validator
```

### Infrastructure Security

1. **Firewall configuration**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Fail2ban for SSH protection**
```bash
sudo apt-get install fail2ban
```

3. **Regular updates**
```bash
sudo apt-get update
sudo apt-get upgrade
```

---

## Performance Optimization

### Frontend

1. **Enable compression in Nginx**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

2. **Browser caching**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Backend

1. **Enable compression**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Database optimization**
- Add indexes on frequently queried columns
- Use connection pooling
- Implement caching with Redis

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :3001
# Kill process
kill -9 <PID>
```

**Database locked:**
```bash
# Check for other processes accessing the database
fuser backend/database.sqlite
```

**WebSocket connection fails:**
- Check firewall rules
- Verify proxy configuration
- Check CORS settings

**Out of memory:**
```bash
# Increase Node.js memory
node --max-old-space-size=4096 src/server.js
```

---

## Health Checks

**Backend health endpoint:**
```bash
curl http://localhost:3001/api/health
```

**Database connection:**
```bash
curl http://localhost:3001/api/statistics/platform
```

---

## Rollback Procedure

If deployment fails:

1. **Stop services**
```bash
docker-compose down
# or
pm2 stop all
```

2. **Restore previous version**
```bash
git checkout <previous-commit>
```

3. **Restore database**
```bash
cp backups/database-backup.sqlite backend/database.sqlite
```

4. **Restart services**
```bash
docker-compose up -d
# or
pm2 restart all
```

---

## Support & Maintenance

### Regular Maintenance Tasks

- [ ] Weekly: Check logs for errors
- [ ] Weekly: Monitor disk space
- [ ] Monthly: Review security updates
- [ ] Monthly: Database cleanup/optimization
- [ ] Quarterly: Review and update dependencies
- [ ] Annually: Renew SSL certificates (if not auto-renewed)

### Getting Help

- GitHub Issues: https://github.com/lesoxm/nowy-xtramarlin/issues
- Documentation: Check `/docs` folder
- Logs: Check application and system logs

---

## Checklist Before Going Live

- [ ] Change JWT_SECRET to secure random string
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up error logging
- [ ] Test all user flows
- [ ] Load testing
- [ ] Security audit
- [ ] Configure firewall
- [ ] Set up domain and DNS
- [ ] Test WebSocket connections
- [ ] Verify file upload limits
- [ ] Check CORS configuration
- [ ] Test on multiple devices
- [ ] Prepare rollback plan
