# 🎓 STEMify Frontend

<div align="center">

![STEMify Logo](https://res.cloudinary.com/dms8gue1c/image/upload/v1765870567/logo_ojradm.png)

**Nền tảng giáo dục STEM tương tác với công nghệ 3D và AI**

<!-- Core -->

[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)](https://nodejs.org/)

<!-- UI & Styling -->

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-Component_System-000000?style=flat)](https://ui.shadcn.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Accessible_UI-black?style=flat&logo=radix-ui)](https://www.radix-ui.com/)
[![Tiptap](https://img.shields.io/badge/Tiptap-Rich_Text_Editor-6E56CF?style=flat)](https://tiptap.dev/)

<!-- 3D -->

[![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black?style=flat&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-Three.js_React-000000?style=flat)](https://docs.pmnd.rs/react-three-fiber)

<!-- AI -->

[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-ML_in_Browser-FF6F00?style=flat&logo=tensorflow)](https://www.tensorflow.org/js)
[![Google_Generative_AI](https://img.shields.io/badge/Google_Generative_AI-AI_Services-4285F4?style=flat&logo=google)](https://ai.google.dev/)

<!-- Auth, State & Tooling -->

[![NextAuth](https://img.shields.io/badge/NextAuth.js-Authentication-black?style=flat)](https://next-auth.js.org/)
[![Redux_Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=flat&logo=redux)](https://redux-toolkit.js.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=flat&logo=vercel)](https://vercel.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=flat&logo=github-actions)](https://github.com/features/actions)

[English](#) | [Tiếng Việt](#)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Phát triển](#-phát-triển)
- [Tài liệu](#-tài-liệu)
- [Đóng góp](#-đóng-góp)

---

## 🌟 Giới thiệu

**STEMify** là một nền tảng giáo dục STEM (Science, Technology, Engineering, Mathematics) hiện đại, tích hợp công nghệ 3D, AI, và lập trình trực quan. Dự án cung cấp trải nghiệm học tập tương tác cho học sinh, giáo viên và tổ chức giáo dục.

### 🎯 Mục tiêu

- 🎨 Tạo trải nghiệm học tập 3D tương tác
- 🤖 Tích hợp AI để hỗ trợ học tập cá nhân hóa
- 📱 Ứng dụng web responsive, tối ưu giao diện cho nhiều kích thước màn hình trên trình duyệt
- 🌐 Đa ngôn ngữ (Tiếng Việt, Tiếng Anh)

---

## ✨ Tính năng chính

### 🎓 Học tập & Quản lý

- **Khóa học tương tác**: Quản lý khóa học, bài học, và tài liệu học tập
- **Bài tập & Quiz**: Hệ thống bài tập và đánh giá tự động
- **Tiến độ học tập**: Theo dõi tiến độ và phân tích kết quả học tập
- **Lớp học ảo**: Quản lý lớp học, học sinh và giáo viên

### 🎨 3D Creator & Assembly

- **Trình soạn 3D**: Tạo và chỉnh sửa mô hình 3D cho giáo dục
- **Assembly Builder**: Xây dựng các mô hình lắp ráp tương tác
- **Transform Controls**: Điều khiển xoay, di chuyển, và scale đối tượng 3D
- **Template Library**: Thư viện component và template có sẵn

### 🤖 AI & Chatbot

- **AI Assistant**: Trợ lý AI hỗ trợ học tập
- **Google Gemini Integration**: Tích hợp AI Gemini
- **Teachable Machine**: ML model training trực tiếp

### 🌐 Đa ngôn ngữ & Đa vai trò

- **i18n Support**: Tiếng Việt và Tiếng Anh
- **Role-based Access**: Admin, Teacher, Student, Organization
- **Real-time Collaboration**: SignalR cho collaboration thời gian thực

### 📊 Dashboard & Analytics

- **Learning Analytics**: Phân tích dữ liệu học tập
- **Progress Tracking**: Theo dõi tiến độ chi tiết
- **Charts & Visualizations**: Biểu đồ với Chart.js và Recharts

---

## 🛠 Công nghệ sử dụng

### Core Framework

- **Next.js 15.5.7** - React framework với App Router
- **React 19.2.1** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### 3D Graphics & Animation

- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer cho Three.js
- **@react-three/drei** - Helper components cho R3F
- **GSAP** - Animation library
- **Framer Motion** - React animation library

### UI Components

- **Radix UI** - Headless UI components
- **Shadcn/ui** - Re-usable component collection
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### State Management

- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Redux Persist** - Persist state

### Backend Integration

- **Next Auth** - Authentication

### Programming Education & STEM Integration

- **Visual Programming UI** - Giao diện lập trình trực quan cho giáo dục STEM
- **External STEM Modules** - Tích hợp các module lập trình và thiết bị thông qua repository riêng

### AI & ML

- **@google/generative-ai** - Google Gemini AI
- **@teachablemachine/image** - ML model integration
- **TensorFlow.js** - ML in browser

### Content & Rich Text

- **Tiptap** - Rich text editor
- **React Markdown** - Markdown rendering
- **MD Editor** - Markdown editor

### Charts & Data Visualization

- **Chart.js** - Chart library
- **Recharts** - React charts
- **react-chartjs-2** - React wrapper cho Chart.js

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Sass** - CSS preprocessor

---

## 💻 Yêu cầu hệ thống

- **Node.js**: >= 20.0.0
- **npm/yarn/pnpm**: Latest version
- **Git**: Latest version
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Capstone-STEMify/STEMify-Frontend.git
cd STEMify-Frontend
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình environment variables

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cấu hình các biến môi trường cần thiết:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# API
NEXT_PUBLIC_API_URL=your_api_url

# Google AI
NEXT_PUBLIC_GOOGLE_AI_KEY=your_gemini_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [https://localhost:3000](https://localhost:3000) để xem kết quả.

> ⚠️ **Lưu ý**: Development server chạy với HTTPS (--experimental-https)

---

## 📁 Cấu trúc dự án

```
STEMify-Frontend/
├── public/                      # Static files
│   ├── animations/             # Lottie animations
│   ├── assemblies/             # 3D assembly JSON files
│   ├── components/             # Component templates
│   ├── images/                 # Images & logos
│   └── models/                 # 3D models
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized pages
│   │   └── api/               # API routes
│   │
│   ├── components/             # Shared components
│   │   ├── layout/            # Layout components
│   │   ├── shadcn/            # Shadcn UI components
│   │   ├── shared/            # Shared UI components
│   │   └── tiptap/            # Tiptap editor components
│   │
│   ├── features/              # Feature modules
│   │   ├── 3d-creator/        # 3D creator feature
│   │   ├── assembly/          # Assembly builder
│   │   ├── auth/              # Authentication
│   │   ├── blockly-*/         # Blockly integrations
│   │   ├── chat/              # Chat & AI assistant
│   │   ├── classroom/         # Classroom management
│   │   ├── course/            # Course management
│   │   ├── dashboard/         # Dashboard & analytics
│   │   └── ...                # Other features
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── i18n/                  # Internationalization
│   ├── libs/                  # Library configurations
│   │   ├── auth/              # Auth config
│   │   ├── redux/             # Redux store
│   │   └── supabase/          # Supabase client
│   │
│   ├── providers/             # Context providers
│   ├── schemas/               # Zod schemas
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
│
├── messages/                   # i18n translations
│   ├── en/                    # English translations
│   └── vi/                    # Vietnamese translations
```

---

## 🔧 Phát triển

### Available Scripts

```bash
# Install
npm install
# Development
npm run dev              # Start dev server with Turbopack & HTTPS

# Build
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# CSS
npm run build:css       # Build and minify CSS
```

### Coding Standards

- **TypeScript**: Sử dụng TypeScript cho tất cả code
- **ESLint**: Tuân thủ ESLint rules
- **Prettier**: Format code trước khi commit
- **Component Structure**: Tạo component theo feature-based structure
- **Naming Convention**:
  - Components: PascalCase
  - Hooks: camelCase with `use` prefix
  - Files: kebab-case hoặc PascalCase

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request
```

### Branch Strategy

- `main`: Production branch
- `dev`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches
- `hotfix/*`: Hotfix branches

---

## 📄 License

Dự án này được phát triển bởi **STEMify Team**.

---

## 🔗 External Repositories

Một số module chuyên biệt trong hệ sinh thái STEMify được phát triển và quản lý dưới dạng repository độc lập để đảm bảo tính mở rộng và dễ bảo trì.

### 🧠 STEMify Micro:bit Platform

- **Repository**: https://github.com/Capstone-STEMify/STEMify-Microbit
- **Mô tả**:  
  Nền tảng lập trình Micro:bit và MakeCode dành cho giáo dục STEM, hỗ trợ lập trình kéo thả, mô phỏng và triển khai cho thiết bị thực tế.
- **Tích hợp**:  
  STEMify Frontend kết nối với module này thông qua API và giao diện tích hợp.

---

## 📞 Liên hệ

- **Organization**: [Capstone-STEMify](https://github.com/Capstone-STEMify)
- **Repository**: [STEMify-Frontend](https://github.com/Capstone-STEMify/STEMify-Frontend)
- **Email**: [stemify30062025@gmail.com
  ](stemify30062025@gmail.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)

---

<div align="center">

**Made with ❤️ by STEMify Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>
