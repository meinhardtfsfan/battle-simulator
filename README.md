# 模拟帝国 - 战斗模拟器

正式版 1.0 | 后端保护版

## 部署指南

### 第一步：Push 到 GitHub

在你的电脑上打开终端（或 Git Bash），依次执行：

```bash
# 1. 克隆你创建的仓库
git clone https://github.com/meinhardtfsfan/battle-simulator.git

# 2. 进入项目目录
cd battle-simulator

# 3. 把我给你的文件复制进来
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
