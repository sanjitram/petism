# PetISM 🚀  
**A Next-Gen Petition Platform for Change**

![PetISM Banner](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue?style=for-the-badge) ![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=for-the-badge)

PetISM is a modern, high-performance web application designed to empower users to start movements, gather support, and achieve victory. Built with a focus on **design, speed, and meaningful interaction**, it transforms the traditional petition experience into something dynamic and engaging.

---

## 🔥 Technical Flex (The Good Stuff)

This isn't just a CRUD app. PetISM leverages a cutting-edge stack to deliver a seamless experience:

### ⚡ **Serverless Backend Architecture**
- **Vercel Serverless Functions**: The Node.js/Express backend is fully adapted to run as serverless functions on Vercel's edge network, ensuring instant scalability and zero idle costs.
- **Fail-Open Rate Limiting**: Powered by **Upstash Redis**, our custom middleware protects API endpoints from abuse without degrading user experience during outages.
- **Dynamic CORS**: Smarter security configuration that adapts effortlessly between local development and production environments.

### 🎨 **Premium Frontend Experience**
- **Framer Motion**: Complex, staggered animations and page transitions bring the interface to life.
- **Glassmorphism UI**: Custom-built `AnimatedCard` and `AnimatedInput` components feature backdrop filters, subtle glows, and micro-interactions.
- **Particles.js Integration**: Interactive background effects that respond to user movement.
- **Optimized SPA Routing**: Configured for seamless navigation whether on localhost or deployed.

### 📧 **Smart Notification System**
- **Real-Time Emails**: Users receive immediate feedback upon petition creation.
- **Victory Triggers**: Automated logic monitors petition progress and fires celebratory "Victory" emails the moment a target is reached.
- **Nodemailer + Gmail Service**: Robust delivery systems ensuring messages land in the primary inbox.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** + **Vite** (Blazing fast HMR)
- **TailwindCSS** + **DaisyUI** (Modern styling)
- **Framer Motion** (Production-grade animations)
- **Lucide React** (Clean SVG icons)
- **Axios** (With interceptors for auth token management)

### **Backend**
- **Node.js** + **Express**
- **MongoDB Atlas** (Cloud-native database)
- **Upstash Redis** (Serverless caching & rate limiting)
- **Bcrypt + JWT** (Secure authentication implementation)
- **Nodemailer** (Transactional email service)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB URI
- Upstash Redis Credentials

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/sanjitram/petism.git
    cd petism
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create .env file:
    # VITE_API_URL=http://localhost:5001/api
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with your credentials (MONGO_URI, JWT_SECRET, etc.)
    npm run dev
    ```

---

## 🛡️ Security Features
- **Secure View Mode**: By default, petition pages are read-only. Editing requires unlocking via password authentication.
- **Environment Isolation**: Strict separation of development and production config prevents data leaks.
- **Input Validation**: Robust checks on both client and server side.

---

## 🤝 Contributing
Contributions are welcome! Fork the repo, create a feature branch, and submit a PR. Let's make change happen together.

---

*Built with ❤️ and ☕ by Sanjit*
