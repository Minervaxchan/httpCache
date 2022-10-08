const http = require('http');
const fs = require('fs');
const url = require('url');
const etag = require('etag');

http.createServer((req, res) => {
  const {
    pathname
  } = url.parse(req.url)
  if (pathname === '/') {
    const data = fs.readFileSync('./index.html');
    res.end(data);
  } else if (/.*?\.jpe?g/.test(pathname)) {
    // res.setHeader('Cache-Control', 'max-age=0');
    res.setHeader('Cache-Control', 'no-cache');

    const stat = fs.statSync('./images/02.jpeg');
    const lastModified = stat.mtime.toUTCString();
    res.setHeader('Last-Modified', lastModified);

    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince === lastModified) {
      res.writeHead(304, 'Not Modified');
      res.end();
      return;
    }
    const data = fs.readFileSync('./images/02.jpeg');
    const etagContent = etag(data);
    // const etagContent = '111';
    res.setHeader('Etag', etagContent);

    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === etagContent) {
      res.writeHead(304, 'Not Modified');
      res.end();
      return;
    }
    res.end(data);
  } else {
    res.end('Not Found')
  }
}).listen(8000, () => {
  console.log('服务已在localhost:8000启动')
})