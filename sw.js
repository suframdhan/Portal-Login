const CACHE_NAME = 'aksara-pwa-v1.5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Tahap 1: Install Service Worker dan simpan file ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
  // Memaksa service worker yang baru untuk segera aktif
  self.skipWaiting(); 
});

// Tahap 2: Mencegat request jaringan (agar bisa jalan saat koneksi lambat/offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, gunakan cache. Jika tidak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});

// Tahap 3: Membersihkan cache lama jika ada update versi PWA
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Pastikan service worker langsung mengontrol halaman
  event.waitUntil(self.clients.claim());
});
