# 🎬 Story Maker

> **AI-Powered Storyboard Creation & Interactive Game Platform**

Transform your creative ideas into compelling visual stories and interactive experiences with the power of artificial intelligence. Story Maker combines cutting-edge AI technologies to generate storyboards, create stunning visuals, and produce engaging interactive games.

[![Built with SvelteKit](https://img.shields.io/badge/Built%20with-SvelteKit-FF3E00?style=flat-square&logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## ✨ Features

### 🤖 **AI-Powered Story Generation**

- **GPT-4 Integration**: Intelligent story outline and scene generation
- **DALL-E 3 Visuals**: Stunning AI-generated images for each scene
- **Interactive Game Creation**: Transform storyboards into playable HTML games with clickable elements
- **LangGraph Workflows**: Advanced AI agent orchestration for complex storytelling

### 👥 **Collaboration & Management**

- **Team Management**: Create and manage collaborative teams
- **User Authentication**: Secure login with Supabase
- **Project Organization**: Track and organize multiple storyboard projects

### 🎨 **Modern User Experience**

- **Responsive Design**: Beautiful interface that works on all devices
- **Accessibility First**: WCAG compliant with comprehensive accessibility features
- **Real-time Updates**: Server-sent events for live progress tracking

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** database
- **API Keys** for AI services (see [Environment Setup](#-environment-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/story-maker.git
cd story-maker

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Start development server
npm run dev

# Serve over HTTPS for PWA testing
npm run dev:https

# Open in browser
npm run dev -- --open
```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# 🤖 AI Services (Required)
OPENAI_API_KEY=your_openai_api_key_here

# 🔍 Search (Optional)
TAVILY_API_KEY=your_tavily_api_key_here

# 🗄️ Database
MONGODB_URI=mongodb://localhost:27017/storymaker

# 🔐 Authentication
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# ☁️ File Storage (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 🔑 Getting API Keys

| Service        | Purpose                          | Get Your Key                                            |
| -------------- | -------------------------------- | ------------------------------------------------------- |
| **OpenAI**     | Story generation & DALL-E images | [OpenAI Platform](https://platform.openai.com/api-keys) |
| **Supabase**   | Authentication & database        | [Supabase Dashboard](https://supabase.com/dashboard)    |
| **Cloudinary** | Image hosting (optional)         | [Cloudinary](https://cloudinary.com/)                   |

---

## 📖 How to Use

### 1. **Create Your Story**

- Fill out the story creation form with your concept
- Choose your preferred style, genre, and target audience
- Specify the number of slides for your storyboard

### 2. **AI Generation Process**

- Watch real-time progress as AI generates your story outline
- DALL-E creates unique visuals for each scene
- Review and refine the generated content
- Edit individual slides as needed

### 3. **Generate Interactive Games**

- Transform your completed storyboard into a playable HTML game
- AI automatically detects interactive elements in your scenes
- Creates clickable hotspots and game mechanics
- Play directly in the browser with hints and progression tracking

### 4. **Collaborate**

- Create teams and invite collaborators
- Manage user roles and permissions
- Share projects across your organization

---

## 🏗️ Project Structure

```
story-maker/
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 langgraph/      # AI workflow orchestration
│   │   ├── 📁 models/         # TypeScript interfaces
│   │   ├── 📁 server/         # Server-side utilities
│   │   └── 📁 schemas/        # Data validation schemas
│   ├── 📁 routes/
│   │   ├── 📁 api/            # REST API endpoints
│   │   ├── 📁 (auth)/         # Authentication pages
│   │   ├── 📁 (protected)/    # Protected user pages
│   │   └── 📁 storyboard/     # Main storyboard interface
│   └── 📄 app.html            # HTML template
├── 📁 static/                 # Static assets
├── 📁 e2e/                    # End-to-end tests
├── 📄 swagger.yaml            # API documentation
└── 📄 ACCESSIBILITY.md        # Accessibility guidelines
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev -- --open   # Start dev server and open browser

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Quality Assurance
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run check           # Type checking
npm run test            # Run all tests
npm run test:e2e        # Run end-to-end tests
npm run test:dev        # Run tests in UI mode

# Documentation
npm run generate-docs            # Generate TypeDoc documentation
npm run generate-swagger # Update API documentation
```

### 🧪 Testing

The project includes comprehensive testing:

- **End-to-End Tests**: Playwright tests for user workflows
- **Accessibility Tests**: Automated accessibility compliance checks
- **Type Safety**: Full TypeScript coverage with strict mode

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:dev

# Run accessibility tests
npm run test:e2e -- --grep "accessibility"
```

---

## 📚 Documentation

- **Documentation**: Check our [Typescript Documentation](https://fac-31.github.io/Pro0623-StoryMaker/typedoc/index.html), [Swagger API](https://fac-31.github.io/Pro0623-StoryMaker/api/index.html)

## 🎯 Tech Stack

### **Frontend**

- **SvelteKit** - Full-stack web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **Lucide Icons** - Consistent icon system

### **Backend**

- **SvelteKit API Routes** - Server-side API
- **MongoDB** - Document database
- **Supabase** - Authentication & real-time features

### **AI & Media**

- **OpenAI GPT-4** - Story generation
- **DALL-E 3** - Image generation
- **LangGraph** - AI workflow orchestration

### **Development Tools**

- **Vite** - Fast build tool
- **Playwright** - End-to-end testing
- **ESLint & Prettier** - Code quality
- **TypeDoc** - Documentation generation

---

## ♿ Accessibility

Story Maker is built with accessibility as a core principle:

- **WCAG 2.1 AA Compliance** - Meets international accessibility standards
- **Keyboard Navigation** - Full keyboard support for all features
- **Screen Reader Support** - Comprehensive ARIA labels and semantic HTML
- **Focus Management** - Proper focus handling in modals and dynamic content
- **Reduced Motion** - Respects user motion preferences

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for detailed guidelines.

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Test across different browsers and devices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Story Maker Team**

[⭐ Star this repo](https://github.com/your-username/story-maker) • [🐛 Report Bug](https://github.com/your-username/story-maker/issues) • [💡 Request Feature](https://github.com/your-username/story-maker/issues)

</div>
