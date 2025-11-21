# 🔗 TinyLink - AI-Powered URL Shortener

A modern, production-grade URL shortener built with Next.js 14, featuring AI-powered smart suggestions, automatic categorization, and security scanning.

## ✨ Features

### Core Features
- ✅ **URL Shortening** - Create short links with auto-generated or custom codes
- ✅ **Click Tracking** - Real-time analytics and click counting
- ✅ **Link Management** - View, search, filter, and delete links
- ✅ **Stats Dashboard** - Detailed analytics for each link

### 🤖 AI-Powered Features
- **Smart Code Suggestions** - AI analyzes URLs to suggest memorable short codes
- **Auto Categorization** - Automatically categorize links (News, Tech, E-commerce, etc.)
- **Security Scanning** - Detect phishing and malicious URLs before shortening
- **Analytics Insights** - Natural language insights from click data

### 🎨 Modern UI/UX
- Responsive design (mobile-first)
- Dark mode support
- Glassmorphism effects
- Smooth animations
- Loading and error states

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **AI**: Google Gemini API
- **Deployment**: Vercel


Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 API Endpoints

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| `POST` | `/api/links` | Create short link | `201`, `409` |
| `GET` | `/api/links` | List all links | `200` |
| `GET` | `/api/links/:code` | Get link stats | `200`, `404` |
| `DELETE` | `/api/links/:code` | Delete link | `204`, `404` |
| `GET` | `/healthz` | Health check | `200` |





# TinyLink
