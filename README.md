# 🎄 Grand Luxury Interactive Christmas Tree
# 豪华互动 3D 圣诞树

> **Merry Christmas! 提前祝大家圣诞快乐！🎄✨**

## 🎅 项目简介 / Project Overview

这是一个基于 Web 的**豪华互动式 3D 圣诞树**体验项目。  
它结合了**电影级的粒子特效**与**实时手势识别**技术，为你带来指尖掌控星辰的魔法体验。

- **作者**: Siheng Tao  
- **协作者**: Gemini AI (Google)  
- **仓库地址**: [https://github.com/SihengTao/ChristmasTree_withGemini](https://github.com/SihengTao/ChristmasTree_withGemini)

本项目主要由 Gemini AI 生成核心代码，**作者本人进行了美化和部分代码的微调**。

---

## ✨ 魔法交互指南 / Magic Interactions

请允许浏览器访问摄像头，并尝试以下手势：

| 手势 (Gesture) | 视觉效果 (Visual Effect) | 魔法原理 (Mechanism) |
| :--- | :--- | :--- |
| **🖐️ 手掌张开**<br>(Open Palm) | **🌌 爆炸成星尘**<br>(Explosion) | 圣诞树瞬间解构，化为漫天漂浮的蓝白冰晶粒子，模拟失重效果。 |
| **✊ 手掌握拳**<br>(Closed Fist) | **🎄 聚合成树**<br>(Reformation) | 星尘粒子受到引力牵引，伴随螺旋轨迹平滑重组回圣诞树形态。 |
| **✊ + ↔️ 握拳移动**<br>(Fist + Move) | **🔄 旋转圣诞树**<br>(Rotate Tree) | 你的拳头就像控制杆，左右移动即可控制圣诞树的旋转方向与速度。 |
| **🖐️ + ↔️ 张手移动**<br>(Open + Move) | **✨ 旋转星空**<br>(Rotate Galaxy) | 当树解体时，移动手掌可带动背景星空旋转，极具沉浸感。 |

---

## 🚀 快速开始 / Quick Start (详细版)

按照以下简单步骤，在你的电脑上启动这个项目。

### 第一步：准备环境

在运行本项目之前，请先确保你的电脑已经安装了 **Node.js**（这是本项目以及现代 Web 项目的基础运行环境）。

你可以通过在终端输入下面的命令来检查是否已经安装：

```bash
node -v
```

- 如果终端返回类似 `v18.x.x` 的版本号，说明 Node.js 已正确安装，可以继续下一步。
- 如果出现 “command not found” 或其他报错，则说明系统中还没有安装 Node.js。

如需安装 Node.js，请前往官方主页下载并安装最新的 **LTS（长期支持版）**：

👉 https://nodejs.org/

- **Windows 用户**：下载对应的 `.msi` 安装包，双击并按照向导一步步安装。  
- **macOS 用户**：可以下载 `.pkg` 安装包直接安装，或使用 Homebrew：

```bash
brew install node
```

安装完成后，请重新打开终端，再次输入：

```bash
node -v
```

确认能看到版本号，即表示环境准备完成。

---

### 第二步：下载代码 (Clone)

打开终端（Terminal）或命令行，输入以下命令将项目下载到本地：

```bash
git clone https://github.com/SihengTao/ChristmasTree_withGemini.git
```

进入项目文件夹：

```bash
cd ChristmasTree_withGemini
```

---

### 第三步：安装工具 (Install)

项目需要一些“原材料”（依赖库）才能运行。输入以下命令自动下载它们：

```bash
npm install
```

> 这一步可能需要几十秒，请耐心等待，直到依赖安装完成。

---

### 第四步：启动魔法 (Run)

一切就绪！输入启动命令：

```bash
npm run dev
```

终端会出现一个类似 `http://localhost:5173/` 的本地地址。  
👉 **按住 Ctrl（或 Cmd）点击该链接**，或在浏览器中直接输入地址访问。

🎉 **现在，对着摄像头伸出你的手，开始体验吧！**

---

---

## 🇬🇧 English Guide

### Project Overview

This is an interactive 3D Christmas Tree experience created by **Siheng Tao**.  
The core structure and logic of the project were primarily generated via interaction with **Gemini AI**, with visual polish and fine-tuning applied manually by the author.

---

### Installation & Usage

#### 0. Environment (Node.js)

Before you start, please make sure **Node.js (v18+ recommended)** is installed.

Check in your terminal:

```bash
node -v
```

If you see a version string like `v18.x.x`, you’re good to go.  
If you see an error such as “command not found”, install Node.js from:

👉 https://nodejs.org/ (download the latest **LTS** version)

---

#### 1. Clone the Repo

Download the source code to your machine:

```bash
git clone https://github.com/SihengTao/ChristmasTree_withGemini.git
cd ChristmasTree_withGemini
```

---

#### 2. Install Dependencies

Install all required libraries (React, Three.js, gesture/hand-tracking stack, etc.):

```bash
npm install
```

---

#### 3. Run Locally

Start the development server:

```bash
npm run dev
```

Then open your browser at:

👉 **http://localhost:5173/**

---

### ⚠️ Important Note

This project relies on **Camera Permissions** to detect your hand gestures.  
When the browser prompts for camera access, please click **Allow**, otherwise the interactive features (explosion, reformation, rotation, background movement) will not work.

---

**Wish you a magical Christmas!** 🎄✨
