# SBTI 人格测试

> MBTI 已经过时，SBTI 来了。

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&labelColor=20232a)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-仅供娱乐-green)

基于原版 SBTI 测试的二改版本，重写了前端与评分算法。

🔗 **在线体验**：[https://sbti.coci.cc](https://sbti.coci.cc)

---

## 改动内容

| 项目 | 原版 | 本版 |
|------|------|------|
| 题库 | 每维度 2 题，共 30 题 | 每维度 12 题，随机抽取 30 / 60 / 90 题 |
| 评分算法 | 欧氏距离硬匹配（L/M/H 离散化） | 贝叶斯高斯概率密度匹配，连续计算 |
| 结果展示 | 单一人格 | 匹配度排名 + 概率前三 |
| 前端 | 原生 HTML + CSS | React 19 + Tailwind CSS v4 + TypeScript |

---

## 技术栈

- **React 19** + **TypeScript**
- **Tailwind CSS v4**（via `@tailwindcss/vite`）
- **Vite 8**
- CDN：阿里云 ESA

---

## 本地运行

```bash
git clone https://github.com/ChuYao233/SBTI-test.git
cd SBTI-test
npm install
npm run dev
```

构建：

```bash
npm run build
```

---

## 项目结构

```
src/
├── data/
│   ├── questions/     # 每个维度一个 .ts 题库文件（S1~So3）
│   ├── types.ts       # 人格库 & 匹配 pattern
│   └── dimensions.ts  # 维度元数据 & 解读文案
├── engine/
│   ├── score.ts       # 贝叶斯高斯评分引擎
│   └── sampler.ts     # 随机题目采样（30/60/90）
├── components/
│   ├── IntroScreen.tsx
│   ├── TestScreen.tsx
│   ├── ResultScreen.tsx
│   └── SiteFooter.tsx
└── App.tsx
```

---

## 作者

| 角色 | 姓名 | 链接 |
|------|------|------|
| 原作者 | @蛆肉儿串儿 | [B站](https://www.bilibili.com/video/BV1LpDHByET6/) · [个人页](https://unun.dev) · [GitHub](https://github.com/UnluckyNinja) |
| 二改作者 | @尧Yao_y | [B站](https://space.bilibili.com/349638942) · [个人页](https://blog.2o.nz) · [GitHub](https://github.com/chuyao233) |

> 本测试仅供娱乐，请勿用于商业用途。

---

蜀ICP备2024102137号-3 · 川公网安备51080202020150号
