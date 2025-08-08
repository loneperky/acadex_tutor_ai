import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken


  // ✅ FIXED: Only reject if token is missing
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorised: No token provided' })
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as {
      userId: string
      email: string
    }

    // Attach decoded info to the request
    (req as any).user = {
      userId: decoded.userId,  // 👈 matches your route usage
      email: decoded.email
    }
    next()
  } catch (error) {
    console.error("Token verification failed", error)
    return res.status(401).json({ message: "Unauthorised: Invalid token" })
  }
}
