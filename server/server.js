import { createServer } from 'node:http';

const hostname = 'localhost';
const port = 3000;

const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        }).end('This is the homepage')
    }

    if (req.method === "GET" && req.url === "/users") {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        }).end('Showing all users')
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
