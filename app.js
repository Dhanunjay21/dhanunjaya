const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  let page = fs.readFileSync("aws.html");
  res.write(page);
  res.end();
});

server.listen(8080, () => {
  console.log("app listen on 8080 port");
});
