var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号\n 例如node server.js 8888 ");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个请求发过来啦！路径（带查询参数）为：" + pathWithQuery);

  console.log(path)
  //请求路径默认值为 /index.html
  path = path === '/' ? '/index.html' : path

  // 获取请求文件的后缀名
  let suffix = path.split('.')
  suffix = suffix[suffix.length-1]

  // 响应文件格式Hash表
  const suffixHash = {
    'html':'text/html',
    'css':'text/css',
    'js':'text/javascript',
    'json':'text/json',
    'png':'image/png',
    'jpg':'image/jpeg'
  }

  
  response.setHeader("Content-Type", `${suffixHash[suffix] || 'text/html'};charset=utf-8`);
  let content;
  try{
    response.statusCode = 200;
    content = fs.readFileSync(`./public${path}`)
  }catch(error){
    response.setHeader("Content-Type", `text/html;charset=utf-8`);
    response.statusCode = 404;
    content = fs.readFileSync(`./public/404.html`)
  }
  response.write(content);
  response.end();

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
