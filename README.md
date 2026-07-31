# 模拟帝国 - 战斗模拟器

正式版 4.0 | 后端保护版

---

## 部署指南

### 第一步：Push 到 GitHub

在你的电脑上打开终端（或 Git Bash），依次执行：

```bash
# 1. 克隆你创建的仓库
git clone https://github.com/meinhardtfsfan/battle-simulator.git

# 2. 进入项目目录
cd battle-simulator

# 3. 把我给你的文件复制进来（api/、public/、package.json）
#    确保目录结构如下：
#    battle-simulator/
#    ├── api/
#    │   └── simulate.js
#    ├── public/
#    │   └── index.html
#    └── package.json

# 4. 添加所有文件
git add .

# 5. 提交
git commit -m "v1.0 后端保护版"

# 6. 推送到 GitHub
git push origin main
```

### 第二步：部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"Add New Project"**
3. 导入你刚创建的 `battle-simulator` 仓库
4. 框架选择 **"Other"**
5. 点击 **Deploy**
6. 等待 1-2 分钟，完成！

### 第三步：访问你的站点

部署成功后，Vercel 会给你一个链接，比如：
```
https://battle-simulator-xxx.vercel.app
```

这就是你的正式版地址，**核心战斗引擎完全隐藏在后端**！

---

## 项目结构

```
battle-simulator/
├── api/
│   └── simulate.js      # 后端战斗引擎（受保护）
├── public/
│   └── index.html       # 前端页面
├── package.json
└── README.md
```

## 技术架构

- **前端**：纯 HTML/CSS/JS（下拉菜单、属性面板、日志渲染）
- **后端**：Vercel Serverless Function（战斗计算核心）
- **API**：POST `/api/simulate`
  - 输入：兵种A/B、数量、组数、模式
  - 输出：战斗日志、胜负结果
