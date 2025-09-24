// keep_alive.js
const http = require('http');

http.createServer((req, res) => {
  res.write("I'm alive");
  res.end();
}).listen(8080, () => {
  console.log("🌐 Keep-alive server running on port 8080");
});
