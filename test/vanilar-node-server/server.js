const http = require('http');

// PORT
const PORT = 3030;
let count = 0;

// server create
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    console.log(count++);
    res.write('ok');
    res.end();
  }
});

// server listen port
server.listen(PORT);

console.log(`Server is running on PORT: ${PORT}`);
