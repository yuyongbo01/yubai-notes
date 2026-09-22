# 余白手记

“余白手记”个人博客源码。项目使用 React 19、TypeScript、Tailwind CSS、Vinext 和 Vite 构建，生产环境由 Vinext 服务进程运行，并通过 Nginx 反向代理。

服务器不再负责编译：推送到 `main` 后，GitHub Actions 会生成经过启动测试和 SHA-256 校验的运行包。服务器只下载发布包、解压并切换版本，适合 1GB 内存的小型服务器。

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

下面的命令会自动安装缺少的 Node.js 22 和 Nginx，下载 GitHub 已构建的运行包、校验文件、注册 systemd 服务，并发布到 80 端口。服务器不会执行 `npm install` 或构建：

```bash
curl -fsSL https://raw.githubusercontent.com/yuyongbo01/yubai-notes/main/scripts/deploy-ubuntu.sh | sudo bash
```

部署到已解析到服务器的域名，并自动申请 Let's Encrypt HTTPS 证书：

```bash
curl -fsSL https://raw.githubusercontent.com/yuyongbo01/yubai-notes/main/scripts/deploy-ubuntu.sh | sudo env DOMAIN=blog.example.com SITE_URL=https://blog.example.com EMAIL=you@example.com bash
```

重复执行同一条命令即可发布新版本。每次部署会创建独立版本目录，并原子切换 `/opt/yubai-notes/current` 软链接；自动保留最近三个版本，失败时不会切换线上版本。

如果 GitHub 刚收到新提交，请先等待仓库中的 `Build runtime release` 工作流完成，再在服务器执行部署命令。

## 常用检查

```bash
npm run lint
npm run build
sudo nginx -t
systemctl status yubai-notes
systemctl status nginx
```
