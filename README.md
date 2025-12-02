# Portfolio

A modern, responsive portfolio website built with React, Vite, and Tailwind CSS. Features a clean design with dark/light mode toggle, project showcase, and contact form.

## 🚀 Features

- **Modern Stack**: React + Vite + Tailwind CSS

- **Responsive Design**: Mobile-first approach

- **Smooth Animations**: Framer Motion for engaging interactions

- **Contact Form**: EmailJS integration for direct messaging

- **Project Showcase**: Dynamic project display with filtering

- **Admin Dashboard**: Secure admin panel for content management

- **Supabase Backend**: Real-time database for dynamic content

## 🛠️ Tech Stack

### Frontend

- **React** - UI framework

- **Vite** - Build tool and dev server

- **Acetenity UI** - UI Component library

- **Tailwind CSS** - Utility-first CSS framework

- **Framer Motion** - Animation library

- **React Hook Form** - Form handling with validation

- **Zod** - Schema validation

- **Lucide React** - Icon library

### Backend & Services

- **Supabase** - Backend-as-a-Service (Database & Auth)

- **EmailJS** - Email service for contact form

- **React Router** - Client-side routing

## 📦 Installation

1\. **Clone the repository**

   ```bash

   git clone

   cd portfolio

   ```

2\. **Install dependencies**

   ```bash

   npm install

   ```

3\. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env

   VITE_SUPABASE_URL=your_supabase_project_url

   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id

   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id

   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

   VITE_SHOW_ADMIN_BUTTON=true

   ```

4\. **Run the development server**

   ```bash

   npm run dev

   ```

## 🏗️ Project Structure

```txt

src/

├── components/

│   ├── sections/          # Page sections (Hero, About, Projects, etc.)

│   ├── ui/               # Reusable UI components

│   └── layout/           # Layout components (Header, Footer)

├── hooks/                # Custom React hooks

├── contexts/             # React contexts (Theme, etc.)

├── stores/               # Zustand stores

├── types/                # TypeScript type definitions

└── utils/                # Utility functions

```

## 🎨 Sections

- **Hero**: Introduction and call-to-action

- **About**: Personal info, skills, and work experience

- **Skills**: Technical skills and proficiencies

- **Projects**: Portfolio projects

- **Contact**: Contact form and social links

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project

2. Set up tables for:

- `projects`

- `skills`

- `experiences`

- `users`

3\. Enable Row Level Security (RLS) as needed

### EmailJS Setup

1. Create an EmailJS account

2. Set up email service (Gmail/Outlook)

3. Create email template

4. Add credentials to environment variables

## 📱 Responsive Design

## 🎯 Customization

### Adding New Projects

Projects are managed through the Supabase database. Add new projects via the admin dashboard or directly in Supabase.

### Modifying Colors

Update the color scheme in `tailwind.config.js` or modify CSS variables in `index.css`.

### Adding New Sections

1. Create new component in `src/components/sections/`

2. Add route in main layout

3. Update navigation if needed

## 🚀 Deployment

### Vercel (Recommended)

```bash

npm run build

vercel --prod

```

### Netlify

```bash

npm run build

```

### Other Platforms

The project can be deployed to any static hosting service that supports SPAs.

## 📝 Scripts

- `npm run dev` - Start development server

- `npm run build` - Build for production

- `npm run preview` - Preview production build

- `npm run lint` - Run ESLint

## 🔒 Environment Variables

All sensitive configuration is managed through environment variables. Never commit actual credentials to version control.

## 🤝 Contributing

1. Fork the repository

2. Create a feature branch

3. Commit your changes

4. Push to the branch

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License

## 👨‍💻 Author

**Ifechukwu Edet**

- GitHub: [@ifechiglory](https://github.com/ifechiglory)

- LinkedIn: [Ifechukwu Edet](https://linkedin.com/in/ifechukwuedet)

- Email: <ifechiglory@gmail.com>

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility framework

- [Supabase](https://supabase.com/) for the backend services

- [Framer Motion](https://www.framer.com/motion/) for smooth animations

- [Lucide](https://lucide.dev/) for beautiful icons
