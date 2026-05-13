# GFlowX 管理端（脚手架）

- **技术栈**：Vite 8、React 19、TypeScript、Ant Design 5、React Router（与 `docs/FRONTEND.md` 对齐中）。
- **开发**：后端 new-api 需已在 `http://127.0.0.1:3000` 运行（如 `./scripts/dev-newapi-sqlite.sh` 或 Docker）。

```bash
npm install
npm run dev
```

浏览器打开 Vite 提示的地址（默认 `http://127.0.0.1:5173`）。`/api` 与 `/v1` 由 Vite 代理到本机 3000 端口。

- **构建**：`npm run build`，产物在 `dist/`。
