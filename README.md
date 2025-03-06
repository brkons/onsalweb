# OnSal Elektronik E-Ticaret Sitesi

## VPS Kurulum Adımları (Ubuntu 22.04)

### 1. Sistem Gereksinimlerinin Kurulumu

```bash
# Sistem paketlerini güncelle
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL kurulumu
sudo apt install postgresql postgresql-contrib -y

# Nginx kurulumu
sudo apt install nginx -y

# Certbot kurulumu (SSL için)
sudo apt install certbot python3-certbot-nginx -y
```

### 2. PostgreSQL Veritabanı Ayarları

```bash
# PostgreSQL servisini başlat
sudo systemctl start postgresql

# PostgreSQL'e giriş yap
sudo -u postgres psql

# Veritabanı ve kullanıcı oluştur
CREATE DATABASE onsal_db;
CREATE USER onsal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE onsal_db TO onsal_user;
```

### 3. Domain ve SSL Ayarları

1. Domain'inizi VPS'inizin IP adresine yönlendirin (A kaydı)
2. Nginx konfigürasyonu oluşturun:

```bash
sudo nano /etc/nginx/sites-available/onsal.conf
```

Aşağıdaki içeriği ekleyin:

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Nginx konfigürasyonunu etkinleştirin:

```bash
sudo ln -s /etc/nginx/sites-available/onsal.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. SSL sertifikası alın:

```bash
sudo certbot --nginx -d your-domain.com
```

### 4. Uygulama Kurulumu

1. Uygulama dizini oluşturun:

```bash
sudo mkdir -p /var/www/onsal
sudo chown -R $USER:$USER /var/www/onsal
```

2. Proje dosyalarını kopyalayın:

```bash
# Proje dosyalarını VPS'e kopyalayın (örnek)
cd /var/www/onsal
git clone your-repository-url .
```

3. Çevre değişkenlerini ayarlayın:

```bash
cp .env.example .env
nano .env
```

4. Uygulamayı başlatın:

```bash
chmod +x start.sh
./start.sh
```

### 5. PM2 ile Uygulama Yönetimi (Opsiyonel)

```bash
# PM2 kurulumu
sudo npm install -g pm2

# Uygulamayı PM2 ile başlat
pm2 start npm --name "onsal" -- start

# Sistem başlangıcında otomatik başlatma
pm2 startup
pm2 save
```

## Önemli Bilgiler

- Node.js sürümü: 20 LTS
- PostgreSQL sürümü: 14 veya üzeri
- Varsayılan port: 5000
- SSL yenileme otomatiktir (certbot-auto-renewal)

## Güvenlik Notları

1. UFW Firewall'u etkinleştirin:
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. PostgreSQL güvenlik ayarları:
- pg_hba.conf dosyasını kontrol edin
- Uzaktan erişimi kısıtlayın
- Güçlü şifreler kullanın

3. Nginx güvenlik başlıkları:
- SSL/TLS ayarlarını optimize edin
- HTTP/2 protokolünü etkinleştirin
- Güvenlik başlıklarını ekleyin

## Sorun Giderme

1. Nginx logları:
```bash
sudo tail -f /var/log/nginx/error.log
```

2. Uygulama logları:
```bash
pm2 logs onsal
```

3. SSL sertifikası yenileme:
```bash
sudo certbot renew --dry-run