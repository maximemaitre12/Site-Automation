import { Request, Response, NextFunction } from 'express'

const SECRET = process.env.API_SECRET

export function apiAuth(req: Request, res: Response, next: NextFunction): void {
  if (!SECRET) {
    next()
    return
  }
  const key = req.headers['x-api-key']
  if (key !== SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
