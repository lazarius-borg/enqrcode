/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// File Share Target Handler
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Handle POST requests to /share-target
    if (event.request.method === 'POST' && url.pathname === '/share-target') {
        event.respondWith(
            (async () => {
                const formData = await event.request.formData();
                const sharedData: Record<string, any> = {};

                // Extract fields
                const title = formData.get('title');
                const text = formData.get('text');
                const urlField = formData.get('url');
                const file = formData.get('file');

                if (title) sharedData.title = title;
                if (text) sharedData.text = text;
                if (urlField) sharedData.url = urlField;

                // If a file is present (specifically VCard for now), read it
                if (file && file instanceof File) {
                    sharedData.fileContent = await file.text();
                    sharedData.fileName = file.name;
                    sharedData.fileType = file.type;
                }

                // Store in Cache API
                const cache = await caches.open('enqrcode-shared-content');
                await cache.put(
                    '/shared-data',
                    new Response(JSON.stringify(sharedData), {
                        headers: { 'content-type': 'application/json' }
                    })
                );

                // Redirect to app with ?shared=true flag
                return Response.redirect('/?shared=true', 303);
            })()
        );
    }
});
