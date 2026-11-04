import { useEffect, useState } from "react"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "../config/firebase"
import { AppForm } from "../lib/applications"

export default function useApplications(userId?: string) {
  const [applications, setApplications] = useState<AppForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setApplications([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const applicationsQuery = query(
      collection(db, "applications", "user/", userId),
    )

    return onSnapshot(
      applicationsQuery,
      (snapshot) => {
        setApplications(
          snapshot.docs.map(
            (document) => ({ id: document.id, ...document.data() }) as AppForm,
          ),
        )
        setIsLoading(false)
      },
      (snapshotError) => {
        setError(snapshotError)
        setIsLoading(false)
      },
    )
  }, [userId])

  return { applications, error, isLoading }
}
