var http = require("http");
var fs = require("fs");
var events = require("events");

// 注册一个事件触发器充当路由
var router = new events.EventEmitter();

router.on("/", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello\n");
});

// api
// 预览pdf
router.on("/api/pdf", function (req, res) {
  res.writeHead(200, { "Content-Type": "application/pdf" });
  fs.readFile("./test.pdf", (err, c) => {
    res.end(c);
  });
});

// 下载pdf
router.on("/api/pdf/download", function (req, res) {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=test.pdf",
    "Cache-Control": "max-age=0",
    "Access-Control-Expose-Headers": "Content-Disposition",
  });
  fs.readFile("./test.pdf", (err, c) => {
    res.end(c);
  });
});

// 404
router.on("404", function (req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found\n");
});

http
  .createServer(function (request, response) {
    console.log("debug", router.listenerCount(request.url), request.url);
    // Listen...
    // 访问页面触发
    // 判断指定事件名名(request.url)上的Listener数量
    if (router.listenerCount(request.url) > 0) {
      // 触发该(request.url)事件 调用绑定在该事件监听的回调函数 模拟路由
      router.emit(request.url, request, response);
    } else {
      router.emit("404", request, response);
    }
  })
  .listen(3000);

console.log("Server running at http://127.0.0.1:3000/");
