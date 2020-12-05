import type { NextApiRequest, NextApiResponse } from 'next'
import { connect } from '~/utils'

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  _id: string
  name: string
  email: string
  phone: string
  teacher: true
  coins: number
  courses: string[]
  available_hours: Record<string, unknown>
  available_locations: string[]
  appointments: Record<string, unknown>[]
  reviews: Record<string, unknown>[]
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponse | SuccessResponse>,
): Promise<void> => {
  if (request.method === 'GET') {
    const { email } = request.query
    if (!email) {
      response.status(400).json({ error: 'Missing query parameter' })
      return
    }
    const { db } = await connect()

    const user = await db.collection('users').findOne({ email })

    if (!user) {
      response.status(400).json({ error: 'User not found' })
      return
    }

    response.status(200).json(user)
  } else {
    response.status(400).json({ error: 'Wrong request method' })
  }
}
