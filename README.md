# Acadex

**Learn smarter, not harder — with AI.**  
Acadex is an AI-powered learning platform that delivers personalized lessons, instant feedback, and smart study recommendations. Built with **React.js**, **Node.js**, **Express**, and **PostgreSQL**, it provides an engaging, responsive, and secure environment for learners to achieve their goals faster.

---

## 🚀 Features
- 🤖 **AI Tutoring** – Personalized learning paths and instant assistance  
- 📚 **Interactive Lessons** – Engaging and easy-to-follow course content  
- 📊 **Progress Tracking** – Monitor your learning journey and get smart recommendations  
- 🔐 **Secure Authentication** – User accounts with full login/registration  
- 📱 **Responsive Design** – Works seamlessly across devices  
- ⚡ **Fast & Optimized** – Smooth experience powered by modern web technologies  

---

## 🛠 Tech Stack
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** Supabase 
- **AI Integration:** Custom AI models / APIs (e.g., OpenAI, TensorFlow, etc.)  
- **Authentication:** JWT-based or cookie-session  

---

## 📦 Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/loneperky/acadex_tutor_ai.git
cd acadex

# 2️⃣ Install frontend dependencies
cd client
npm install

# 3️⃣ Install backend dependencies
cd ../server
npm install

# 4️⃣ Create environment variables (inside server/.env)
echo "PORT=5050" >> .env
echo "DATABASE_URL=your_database_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "AI_API_KEY=your_ai_api_key" >> .env

# 5️⃣ Run backend server
npm run dev

# 6️⃣ Open a new terminal, start frontend
cd ../client
npm start
