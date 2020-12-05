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
  if (request.method === 'POST') {
    const {
      name,
      email,
      phone,
      teacher,
      courses,
      available_hours,
      available_locations,
    } = request.body

    if (teacher !== false && teacher !== true) {
      response
        .status(400)
        .json({ error: 'teacher params must be true or false' })
      return
    }
    if (!teacher) {
      if (!name || !email || !phone) {
        response.status(400).json({ error: 'Missing body parameter' })
        return
      }
    } else if (teacher) {
      if (
        !name ||
        !email ||
        !phone ||
        !teacher ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        response.status(400).json({ error: 'Missing body parameter' })
        return
      }
    }

    const { db } = await connect()
    const lowerEmail = email.toLowerCase()
    const emailExists = await db
      .collection('users')
      .findOne({ email: lowerEmail })

    if (emailExists) {
      response.status(400).json({ error: 'Email already exists' })
      return
    }

    const user = await db.collection('users').insertOne({
      name,
      email: lowerEmail,
      phone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      appointments: [],
      reviews: [],
    })

    response.status(200).json(user.ops[0])
  } else {
    response.status(400).json({ error: 'Wrong request method' })
  }
}
