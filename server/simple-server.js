const http = require('http');
const port = process.env.PORT || 3000;

console.log('Starting simple server...');

const server = http.createServer((req, res) => {
    console.log('Received request');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
