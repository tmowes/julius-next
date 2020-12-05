/* eslint-disable @typescript-eslint/no-explicit-any */
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
  response: NextApiResponse<ErrorResponse | SuccessResponse[]>,
): Promise<void> => {
  if (request.method === 'GET') {
    const { courses } = request.body
    if (!courses) {
      response.status(400).json({ error: 'Missing body parameter' })
      return
    }

    const { db } = await connect()

    const teachers = await db
      .collection('users')
      .find({
        courses: {
          $in: [new RegExp(`${courses}`, 'i')],
        },
      })
      .toArray()

    if (teachers.length === 0) {
      response.status(400).json({ error: 'Course not found' })
      return
    }

    response.status(200).json(teachers)
  } else {
    response.status(400).json({ error: 'Wrong request method' })
  }
}
