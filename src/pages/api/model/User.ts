export interface User {
  _id: string
  name: string
  email: string
  phone: string
  teacher: boolean
  coins: number
  courses: string[]
  available_hours: Record<string, number[]>
  available_locations: string[]
  reviews: Record<string, unknown>[]
  appointments: Appointment[]
}

export interface Appointment {
  date: string
}
