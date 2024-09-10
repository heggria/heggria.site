#!/bin/bash

# 进入指定的路径
cd $PATH

# 拉取最新的代码
git pull origin main

# 安装依赖
npm install

# 编译项目
npm run build

# (可选) 重启服务
# pm2 restart all  # 假设使用 pm2 管理服务
