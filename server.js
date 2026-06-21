const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = path.join(process.cwd(), parsedUrl.pathname);

    // If directory, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // If exists directly, serve it
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('404 Not Found: ' + parsedUrl.pathname);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
});

server.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
    console.log('Landing: http://localhost:3001/index.html');
    console.log('Destino ejemplo: http://localhost:3001/destino.html?id=default-mdp');
});
