# 余白手记

“余白手记”个人博客源码。项目使用 React 19、TypeScript、Tailwind CSS、Vinext 和 Vite 构建，生产环境由 Nginx 直接提供纯静态页面。

服务器不再负责编译，也不需要运行 Node.js：推送到 `main` 后，GitHub Actions 会生成经过访问测试和 SHA-256 校验的静态站点包。服务器只通过 Git 拉取几 MB 的 HTML、CSS、JavaScript 和图片，适合 1GB 内存的小型服务器。

> `/studio` 当前是交互演示界面，不是带数据库和真实鉴权的生产 CMS；演示登录信息不能用于保护真实内容。

## 本地开发

需要 Node.js `22.13.0` 或更高版本：

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://你的域名 npm run build
```

## Ubuntu/Debian 一键部署

下面的命令会自动安装缺少的 Nginx，通过 Git 获取 GitHub 已构建的静态包、校验文件并发布到 80 端口。服务器不会执行 `npm install`、构建或运行 Node.js：

```bash
curl -fsSL https://raw.githubusercontent.com/yuyongbo01/yubai-notes/main/scripts/deploy-ubuntu.sh | sudo bash
```

部署到已解析到服务器的域名，并自动申请 Let's Encrypt HTTPS 证书：

```bash
curl -fsSL https://raw.githubusercontent.com/yuyongbo01/yubai-notes/main/scripts/deploy-ubuntu.sh | sudo env DOMAIN=blog.example.com SITE_URL=https://blog.example.com EMAIL=you@example.com bash
```

重复执行同一条命令即可发布新版本。每次部署会创建独立版本目录，并原子切换 `/opt/yubai-notes/current` 软链接；自动保留最近三个版本，失败时不会切换线上版本。

如果 GitHub 刚收到新提交，请先等待仓库中的 `Build static release` 工作流完成，再在服务器执行部署命令。

## 常用检查

```bash
npm run lint
npm run build
sudo nginx -t
systemctl status nginx
```
