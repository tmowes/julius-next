import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectID } from 'mongodb'
// import { getSession } from 'next-auth/client'
import { connect } from '~/utils'

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  date: string
  teacher_name: string
  teacher_id: string
  student_name: string
  student_id: string
  course: string
  location: string
  appointment_link: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponse | SuccessResponse>,
): Promise<void> => {
  if (request.method === 'POST') {
    // const session = await getSession({ req: request })
    // if (!session) {
    //   response.status(404).json({ error: 'Missing authentication credentials' })
    //   return
    // }

    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    }: SuccessResponse = request.body

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      response.status(400).json({ error: 'Missing body parameter' })
      return
    }

    let testTeacherID
    let testStudentID
    try {
      testTeacherID = new ObjectID(teacher_id)
      testStudentID = new ObjectID(student_id)
    } catch {
      response.status(400).json({ error: 'ObjectID invalid' })
      return
    }

    if (!testTeacherID || !testStudentID) {
      response.status(400).json({ error: 'ObjectID invalid' })
      return
    }

    const parsedDate = new Date(date)
    const now = new Date()
    const today = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    }
    const fullDate = {
      day: parsedDate.getDate(),
      month: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
    }

    if (
      fullDate.year < today.year ||
      fullDate.month < today.month ||
      fullDate.day < today.day
    ) {
      response
        .status(400)
        .json({ error: "Can't create appointment on the past" })
      return
    }

    const { db } = await connect()

    const teacherExists = await db
      .collection('users')
      .findOne({ _id: testTeacherID })

    const studentExists = await db
      .collection('users')
      .findOne({ _id: testStudentID })

    if (!teacherExists && !studentExists) {
      response.status(400).json({ error: 'TeacherID not found' })
      return
    }

    if (studentExists.coins === 0) {
      response.status(400).json({ error: 'TeacherID not found' })
      return
    }

    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]

    const requestDay = weekdays[parsedDate.getDay()]

    const requestHour = parsedDate.getUTCHours() - 3

    if (!teacherExists.available_hours[requestDay]?.includes(requestHour)) {
      response.status(400).json({
        error: `Teacher ${teacher_name} is not available at ${requestDay} ${requestHour}:00`,
      })
      return
    }

    teacherExists.appointments.forEach(
      (appointment: { date: string | number | Date }) => {
        const appointmentDate = new Date(appointment.date)

        if (appointmentDate.getTime() === parsedDate.getTime()) {
          response.status(400).json({
            error: `Teacher ${teacher_name} already have an appointment at ${appointmentDate.getDate()}/${
              appointmentDate.getMonth() + 1
            }/${appointmentDate.getFullYear()} ${
              appointmentDate.getUTCHours() - 3
            }:00`,
          })
        }
      },
    )

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || '',
    }

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointment }, $inc: { coins: 1 } },
      )

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointment }, $inc: { coins: -1 } },
      )

    if (!appointment) {
      response.status(400).json({ error: 'Appointment not created' })
      return
    }

    response.status(200).json(appointment)
  } else {
    response.status(400).json({ error: 'Wrong request method' })
  }
}
