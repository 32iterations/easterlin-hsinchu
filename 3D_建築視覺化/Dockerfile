FROM node:18-alpine

WORKDIR /app

# 創建簡單的 Node.js 伺服器
RUN echo 'const express = require("express"); \
const path = require("path"); \
const app = express(); \
\
app.use(express.static(path.join(__dirname))); \
\
app.get("/", (req, res) => { \
  res.sendFile(path.join(__dirname, "赤土崎多功能館_完全獨立版.html")); \
}); \
\
const PORT = 8080; \
app.listen(PORT, () => { \
  console.log(`✅ Server running at http://localhost:${PORT}`); \
  console.log(`✅ Map URL: http://localhost:${PORT}/赤土崎多功能館_完全獨立版.html`); \
});' > server.js && \
echo '{"dependencies": {"express": "^4.18.2"}}' > package.json && \
npm install --quiet

EXPOSE 8080

CMD ["node", "server.js"]
