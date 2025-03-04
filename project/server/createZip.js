import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zip dosyası oluştur
const output = fs.createWriteStream('project.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // En yüksek sıkıştırma
});

// Zip işlemi bittiğinde
output.on('close', () => {
  console.log('Zip dosyası oluşturuldu');
  console.log('Toplam boyut: ' + (archive.pointer() / 1024 / 1024).toFixed(2) + ' MB');
});

// Hata durumunda
archive.on('error', (err) => {
  throw err;
});

// Zip dosyasına yönlendir
archive.pipe(output);

// Dosyaları ekle
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'),
  ignore: [
    '**/node_modules/**',
    '**/.git/**',
    '**/.DS_Store',
    '**/dist/**',
    '**/*.log',
    '**/project.zip'
  ]
});

// Zip işlemini başlat
archive.finalize();