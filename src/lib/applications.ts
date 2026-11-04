import { Timestamp } from "firebase/firestore"

export const APPLICATION_STATUSES = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "screening",
  "assessment",
] as const

export type ApplicationStatus = typeof APPLICATION_STATUSES[number]
export type ApplicationFilter = "all" | ApplicationStatus

export interface AppForm {
  id: string
  company: string
  title: string
  link?: string
  salary: number
  status: "" | ApplicationStatus
  notes: string
  date?: Date | Timestamp
  date_applied: Date | Timestamp
  location?: string
}

export const EMPTY_APPLICATION: AppForm = {
  id: "",
  company: "",
  title: "",
  link: "",
  salary: 0,
  notes: "",
  date: new Date(),
  date_applied: new Date(),
  location: "",
  status: "",
}

export function getApplicationDate(value: Date | Timestamp) {
  return value instanceof Date ? value : value.toDate()
}

export function formatStatus(status: ApplicationFilter | "") {
  if (!status) return "None"
  return status.charAt(0).toUpperCase() + status.slice(1)
}
