# 外网访问说明

## 为什么 Cursor Web Agent 里打不开的「本地链接」

在 **Cursor Web** 或云端 Agent 环境里，服务跑在 **远程容器** 里。对话里给的 `http://localhost:3000` 指的是 **那台远程机自己的回环地址**，你本机浏览器无法直接访问。

要在 **你自己的浏览器** 里打开 new-api，需要下面之一：

- 在 **你本机**（或你能 SSH 的服务器）上跑 Docker，再用 **内网穿透 / 隧道** 生成公网 HTTPS 地址；或  
- 把服务部署到 **有公网 IP 或域名** 的云主机 / PaaS；或  
- **无 Docker**：在能跑 Go + Node 的环境用 SQLite 起 new-api，再在同一台机器上对 `127.0.0.1:3000` 跑 **cloudflared Quick Tunnel**（见下文「无 Docker」）。

**稳定域名 / 长期公网入口** 需要你自己配置（Named Tunnel、云主机等）；**临时 trycloudflare 链接** 一般在每次启动隧道时生成，适合开发联调。

---

## 无 Docker：源码 + SQLite + Quick Tunnel（适合 Agent 容器 / 本机）

环境要求：**Go**（建议与 `backend/go.mod` 一致）、**Node/npm**。

1. 拉子模块并应用 gflowx-api 后端补丁，然后在仓库根目录执行：

   ```bash
   git submodule update --init --recursive
   ./scripts/apply-gflowx-backend-patch.sh
   ./scripts/dev-newapi-sqlite.sh
   ```

   首次会构建 `backend/web/default` 前端；若未单独构建 classic，脚本会用 **default 的 `dist` 复制到 classic** 以满足 Go `embed`（仅开发验证；与官方完整构建不等价）。

2. 另开终端，安装或下载 **cloudflared** 后执行：

   ```bash
   cloudflared tunnel --url http://127.0.0.1:3000
   ```

   日志里会出现 `https://xxxx.trycloudflare.com`，用浏览器打开即可访问该环境上的 new-api。

3. 说明：部分沙箱 **无法解析** `*.trycloudflare.com` 的 DNS，但 **你本机浏览器** 通常可以；若仍打不开，在你自己电脑上重复上述步骤即可。

---

## 方案一（推荐）：Docker + Cloudflare Quick Tunnel

仓库已提供 **`docker-compose.tunnel.yml`**，在官方 compose 基础上增加 `cloudflared` 侧车，把 `new-api:3000` 暴露为 `*.trycloudflare.com` 的 HTTPS 地址（无需 Cloudflare 账号）。

### 步骤

1. 在 **安装了 Docker** 的机器上克隆并拉子模块：

   ```bash
   git clone --recurse-submodules <你的仓库克隆 URL>
   cd gflowx-api
   ```

2. 启动 **new-api + 数据库 + Redis + 隧道**：

   ```bash
   ./scripts/up-with-tunnel.sh
   ```

   等价于：

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.tunnel.yml --profile tunnel up -d
   ```

3. 查看公网地址（日志里会出现 `https://xxxx.trycloudflare.com`）：

   ```bash
   ./scripts/show-tunnel-url.sh
   ```

   或手动：

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.tunnel.yml logs cloudflared 2>&1 | grep -E 'https://.*trycloudflare|INF'
   ```

4. 用浏览器打开该 **HTTPS** 链接即可从外网访问 new-api 控制台与 API。

### 注意

- Quick Tunnel **每次重启 URL 会变**，且 **全网可访问**（知道链接的人都能试连）。仅适合开发/演示。  
- 务必修改 `backend/docker-compose.yml` 中的 **默认密码** 后再长期暴露。  
- 需要 **Docker Compose** 支持 `profiles` 与多文件合并（较新的 Compose V2 即可）。

---

## 方案二：本机 Docker + cloudflared 二进制（不增加容器）

先 `docker compose up -d`，再在宿主机安装 [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) 后执行：

```bash
cloudflared tunnel --url http://127.0.0.1:3000
```

终端里会打印 `https://....trycloudflare.com`。

---

## 方案三：ngrok

```bash
ngrok http 3000
```

按 ngrok 控制台给出的 **Forwarding** URL 访问。

---

## 方案四：云服务器 + 安全组 +（可选）HTTPS

1. 在云主机安装 Docker，开放安全组 **3000**（或你映射的端口）。  
2. `docker compose up -d`，用 `http://<公网IP>:3000` 访问。  
3. 生产建议在前面加 **Nginx / Caddy** 做 HTTPS 与访问控制。

---

## 与 Cursor Cloud Agent 相关的说明

社区里也有「云端 Agent 如何暴露端口」的讨论，标准 **Cursor Cloud Agent 并不会自动给你一个可转发到本地的公网预览链接**；若团队有合规与网络要求，可考虑 Cursor 文档中的 **Self-Hosted Cloud Agent** 等方案，在自有基础设施上跑 Agent 与预览。

本仓库提供的隧道方案适用于：**你在自己能执行 Docker 的环境启动栈**，再把生成的 **trycloudflare / ngrok** 链接贴回对话或发给同事使用。
