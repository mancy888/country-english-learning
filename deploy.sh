#!/usr/bin/env bash
# ===================================================================
#  一键部署 country-english-learning 到 GitHub Pages
# -------------------------------------------------------------------
#  用法:
#    bash deploy.sh                                  # 交互输入 PAT，部署仓库内现有改动
#    GH_PAT=ghp_xxx bash deploy.sh                   # 用环境变量里的 token，免输入
#    SOURCE_HTML=/path/to/x.html bash deploy.sh      # 先把源文件同步为 index.html 再部署
#
#  说明:
#    - 仓库目录 = 本脚本所在目录（D:\Workbuddy Files\country-english-learning）
#    - 直接修改本目录里的 index.html 后运行即可发布
#    - token 仅运行时使用，结束后会从 git remote 里清除，不落盘
# ===================================================================
set -uo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
OWNER_REPO="mancy888/country-english-learning"
TOKENLESS_REMOTE="https://github.com/${OWNER_REPO}.git"
PAGES_URL="https://mancy888.github.io/country-english-learning/"
NODE="C:/Users/VIP/.workbuddy/binaries/node/versions/22.22.2/node.exe"

echo "📁 仓库目录: $REPO_DIR"

# 1) 可选：从源文件同步 index.html
if [ -n "${SOURCE_HTML:-}" ] && [ -f "$SOURCE_HTML" ]; then
  echo "🔄 同步源文件 -> index.html"
  cp "$SOURCE_HTML" "$REPO_DIR/index.html"
fi

# 2) 取 GitHub token（优先环境变量，否则交互输入）
TOKEN="${GH_PAT:-}"
if [ -z "$TOKEN" ]; then
  read -r -s -p "🔑 输入 GitHub PAT (ghp_xxx): " TOKEN
  echo
fi
if [ -z "$TOKEN" ]; then
  echo "❌ 未提供 token，已退出"; exit 1
fi

cd "$REPO_DIR"

# 3) 临时配置带 token 的 remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://mancy888:${TOKEN}@github.com/${OWNER_REPO}.git"

# 4) 先拉取远端最新，避免冲突（失败不阻断）
echo "⬇️  拉取远端最新..."
git pull --rebase --autostash origin main 2>&1 | tail -3 || echo "⚠️  拉取跳过"

# 5) 提交改动
git add -A
if git diff --cached --quiet; then
  echo "✅ 没有需要提交的改动"
else
  MSG="update: $(date '+%Y-%m-%d %H:%M:%S')"
  git -c user.name="${GIT_NAME:-MancyXu}" -c user.email="${GIT_EMAIL:-manman.xu@transfinder.com}" commit -q -m "$MSG"
  echo "✅ 已提交: $MSG"
fi

# 6) 推送
echo "🚀 推送到 GitHub..."
git push -u origin main 2>&1 | tail -5

# 7) 启用 GitHub Pages（若已启用会返回 409，可忽略）
echo "⚙️  确保 GitHub Pages 已开启..."
curl -s -o /dev/null -w "Pages 开启状态: %{http_code}\n" -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/${OWNER_REPO}/pages" \
  -d '{"source":{"branch":"main","path":"/"}}' || true

# 8) 清掉 remote 里的 token，避免明文落盘
git remote set-url origin "$TOKENLESS_REMOTE"

# 8) 轮询 Pages 构建
echo "⏳ 等待 GitHub Pages 重新构建..."
i=1
while [ "$i" -le 12 ]; do
  if [ -x "$NODE" ]; then
    "$NODE" -e "setTimeout(()=>process.exit(0),15000)" 2>/dev/null || true
  else
    sleep 15 2>/dev/null || true
  fi
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PAGES_URL")
  echo "  尝试 $i: 线上 HTTP $CODE"
  if [ "$CODE" = "200" ]; then echo "🎉 已上线: $PAGES_URL"; break; fi
  i=$((i+1))
done
