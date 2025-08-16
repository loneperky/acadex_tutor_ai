import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { LoginRoute } from './routes/auth/login'
import { SignupRoute } from './routes/auth/Signup'
import { ForgotPasswordRoute } from './routes/auth/forgotPassword'
import { RefreshTokenRoute } from './routes/auth/refresh'
import { LogOutRoute } from './routes/auth/logout'
import { ProfileRoute } from './routes/userDetailsRoutes/profile'
import cors from 'cors'
import { OpenAI } from './controller/openai'
import youtubeRoutes from './controller/googleAPI'
import { TrackUserTime } from './routes/userDetailsRoutes/trackTime'
import { Bookmark } from './routes/userDetailsRoutes/bookmarks'
import { MeRoute } from './routes/userDetailsRoutes/me'
import { DeleteRoute } from './routes/auth/delete'
import { GoogleAuth } from './routes/auth/google'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5050

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["http://localhost:8080","https://acadex-tutor-ai.vercel.app"],
  credentials: true
}))
//Auth Routesb
app.use("/auth", SignupRoute)
app.use("/auth", LoginRoute)
app.use("/auth", ForgotPasswordRoute)
app.use("/auth", RefreshTokenRoute)
app.use("/auth", LogOutRoute)
app.use("/auth", DeleteRoute)
app.use("/auth",GoogleAuth)
app.use("/me", MeRoute)

// User Route
app.use("/user", ProfileRoute)
app.use("/user", TrackUserTime)
app.use("/user", Bookmark)


// OpenAI API Route
app.use("/api", OpenAI)
app.use("/api/youtube", youtubeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello")
})

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`)
})