/* eslint-disable no-underscore-dangle */
import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectID } from 'mongodb'
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
  if (request.method === 'GET') {
    const { id } = request.query
    if (!id) {
      response.status(400).json({ error: 'Missing body parameter' })
      return
    }

    let _id: ObjectID
    try {
      _id = new ObjectID(id as string)
    } catch {
      response.status(400).json({ error: 'Wrong ObjectID' })
      return
    }

    const { db } = await connect()

    const user = await db.collection('users').findOne({ _id })

    if (!user) {
      response.status(400).json({ error: 'Teacher not found' })
      return
    }

    response.status(200).json(user)
  } else {
    response.status(400).json({ error: 'Wrong request method' })
  }
}
