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
  teacher: boolean
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponse | SuccessResponse>,
): Promise<void> => {
  if (request.method === 'POST') {
    const { name, email, phone, teacher } = request.body

    if (!name || !email || !phone) {
      response.status(400).json({ error: 'missing params' })
      return
    }
    if (teacher !== false && teacher !== true) {
      response
        .status(400)
        .json({ error: 'teacher params must be true or false' })
      return
    }

    const { db } = await connect()

    const user = await db.collection('users').insertOne({
      name,
      email,
      phone,
      teacher,
    })

    response.status(200).json(user.ops[0])
  } else {
    response.status(400).json({ error: 'invalid connection' })
  }
}
