// service-worker.js

const CACHE_NAME = 'englishfun-v1';
const urlsToCache = [
    // Pastikan semua path di sini relatif terhadap ROOT SCOPE Service Worker
    // Jika service-workers.js berada di C:\xampp\htdocs\project_PWA\
    // maka './' akan merujuk ke C:\xampp\htdocs\project_PWA\
    './index.html',       // PERBAIKAN: Tambah './'
    './latihan.html',     // PERBAIKAN: Tambah './'
    './latihan2.html',    // PERBAIKAN: Tambah './'
    './style.css',        // PERBAIKAN: Tambah './'
    './images2.jpeg',     // PERBAIKAN: Tambah './'
    './manifest.json',    // PERBAIKAN: Tambah './'
    './icon-192x192.png', // PERBAIKAN: Tambah './'
    './icon-512x512.png'  // PERBAIKAN: Tambah './'
];

// Install the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets'); // Debugging log
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Gagal menyimpan aset', error); // Debugging log
            })
    );
});

// Fetch assets from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return the cached response if found, otherwise fetch from network
                return response || fetch(event.request);
            })
            .catch(error => {
                console.error('Service Worker: Gagal mengambil dari cache atau jaringan', error); // Debugging log
                // Opsional: Jika Anda ingin memberikan halaman offline kustom
                // return caches.match('./offline.html');
            })
    );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName); // Debugging log
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Klaim klien segera setelah aktivasi agar halaman saat ini segera dikontrol oleh SW baru
    event.waitUntil(clients.claim());
});