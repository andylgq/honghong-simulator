# AGENTS.md

## 项目概览

"哄哄模拟器" - 一款 AI 对话模拟游戏。玩家扮演男朋友，通过选择对话选项来安慰生气的女朋友。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19 + TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **AI**: coze-coding-dev-sdk (LLM)
- **Database**: Supabase PostgreSQL (coze-coding-dev-sdk)
- **Auth**: bcryptjs (密码哈希) + jose (JWT)，双通道认证（Cookie + Bearer Header）

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── game/
│   │   │   ├── start/route.ts    # 游戏初始化 API
│   │   │   └── choose/route.ts   # 对话选择 API
│   │   └── auth/
│   │       ├── register/route.ts # 注册 API
│   │       ├── login/route.ts    # 登录 API
│   │       ├── logout/route.ts   # 登出 API
│   │       └── me/route.ts       # 当前用户 API
│   ├── blog/
│   │   ├── page.tsx          # 博客列表页
│   │   └── [slug]/page.tsx   # 博客详情页
│   ├── login/page.tsx        # 登录页
│   ├── register/page.tsx     # 注册页
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 主游戏页面 (客户端)
│   ├── globals.css           # 全局样式
│   └── middleware.ts         # 认证中间件
├── lib/
│   ├── auth.ts               # 认证工具 (JWT/bcrypt)
│   ├── game-types.ts         # 游戏类型定义
│   ├── game-prompts.ts       # AI 提示词和常量
│   ├── blog-data.ts          # 博客文章数据
│   └── utils.ts              # 工具函数
├── storage/database/
│   ├── supabase-client.ts    # Supabase 客户端
│   └── shared/schema.ts      # Drizzle 数据库 Schema
└── components/ui/            # shadcn/ui 组件
```

## 核心功能

- **用户认证**: 注册/登录/登出，bcrypt 密码哈希 + JWT cookie 会话
- **中间件保护**: 首页和游戏页面需要登录，/login、/register、/blog 公开访问
- **游戏状态**: start → playing → typing → result
- **情绪系统**: 0-100, ≥80 胜利, ≤20 失败, 超过15轮冷战
- **AI 对话**: 使用 doubao-seed-2-0-mini-260215 模型
- **选项系统**: 每轮 2-4 个选项，有好/中/坏三种质量
- **恋爱攻略博客**: 3 篇 LLM 生成的恋爱技巧文章，列表页 `/blog`，详情页 `/blog/[slug]`

## 开发命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm ts-check` - TypeScript 类型检查
- `pnpm lint` - ESLint 检查
