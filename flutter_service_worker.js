'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "c4b347e3ad5493ac7aff21440c874bda",
"index.html": "0f6892adac18878fb953cf3a0f35c00f",
"/": "0f6892adac18878fb953cf3a0f35c00f",
"styles.css": "01ddf5811b8593a3d721ede630e064d4",
"main.dart.js": "6d685c7670ad92bebfdd22a3d955aeb4",
"flutter.js": "4af2b91eb221b73845365e1302528f07",
"img/guvenStore_logo.png": "a27654bb1673d3288b628722089b4c2d",
"favicon.png": "2a0a326ddfe930ea67f691dc04284040",
"icons/Icon-192.png": "2a0a326ddfe930ea67f691dc04284040",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "2bcb0df4b23750d06bbd283bd86d7b60",
"assets/AssetManifest.json": "a4b3fa46367e64aee80fecdf1424976d",
"assets/NOTICES": "b1387c38791b04d9ef32ee06d32781e5",
"assets/FontManifest.json": "dcb1dfeaff398bc417d5442466c58834",
"assets/AssetManifest.bin.json": "11c524e0002f46aa5c43ffb3c75da4e7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ae9604c4161b3615746759f96688056d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "e33c254655d410bba5358577c1a65ecc",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "adac17b5b2a0c6ebbb29b9bfbb03c91e",
"assets/packages/social_media_flutter/fonts/icons.ttf": "7dae615e8df7bf5bf381bf713850ac33",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "7a836f04e6dad9341067327e46dbf505",
"assets/fonts/MaterialIcons-Regular.otf": "9e520ee5e37a8ec5988c998b0e867ac5",
"assets/assets/logo/gudea_light.png": "2066d61aebb5616b3ed42577e003ba99",
"assets/assets/logo/logo_ltd.jpeg": "427bc9529be276bf1bc33356bfd17d64",
"assets/assets/logo/gudea_dark.png": "c4875ef4aa5b526c1842c67a319431d1",
"assets/assets/logo/guvenStore_light.png": "a27654bb1673d3288b628722089b4c2d",
"assets/assets/logo/guvenStore_dark.png": "f048a5ed17ae9cb464fe977ec1fdfa4a",
"assets/assets/media/kategori.jpg": "e8c2c41b8f2f793f62026519fc779036",
"assets/assets/media/loginView.jpg": "caec6b133ed211b2ec399d1aa0048f7d",
"assets/assets/media/loginView1.jpg": "aedb869069bee041bd0b92b16a31b3ae",
"assets/assets/media/sanalTur.png": "b91e3ff8fbe009dc6ac6c142cdcd8f49",
"assets/assets/media/konum.png": "acea946f6b91e18955f287c149ac3fe9",
"assets/assets/media/guvenQR.jpg": "33a869c868fcbc606e044537906bdc9b",
"assets/assets/media/images.jpg": "957dd6050ce068dff01db31c3da65d97",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "cc728537b31d099870b80e82c164775b",
"canvaskit/canvaskit.js.symbols": "ee28c743c79cf9fe910e61b7fd95b93c",
"canvaskit/skwasm.wasm": "ce8b3e20606f87265c0c0d14d8968068",
"canvaskit/chromium/canvaskit.js.symbols": "24907d700736ef0810e19bdf1cb84c22",
"canvaskit/chromium/canvaskit.js": "2f82009588e8a72043db753d360d488f",
"canvaskit/chromium/canvaskit.wasm": "0e4b52c4ab1be1280ef35144ae0817df",
"canvaskit/canvaskit.js": "7737f5fc722b6a040ac15271ea8d92fb",
"canvaskit/canvaskit.wasm": "97f0f58b59576116cea6338ff17fd1fc",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
