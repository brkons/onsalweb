#!/bin/bash

# Gerekli npm paketlerini yükle
npm install

# Veritabanı şemasını oluştur
npm run db:push

# Uygulamayı production modunda başlat
npm run build && npm start
