'use client'

import { Suspense, useEffect, useState } from 'react'
import { AddLinkFab } from './add-link-fab'
import { useAddIntent } from '@/hooks/use-add-intent'

function AddIntentHandler({ onRequestOpen }: { onRequestOpen: () => void }) {
  const { shouldOpenAddSheet, consume } = useAddIntent()

  useEffect(() => {
    if (shouldOpenAddSheet) {
      onRequestOpen()
      consume()
    }
  }, [shouldOpenAddSheet, consume, onRequestOpen])

  return null
}

export function DashboardClient() {
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <>
      <Suspense fallback={null}>
        <AddIntentHandler onRequestOpen={() => setFabOpen(true)} />
      </Suspense>
      <AddLinkFab open={fabOpen} onOpenChange={setFabOpen} />
    </>
  )
}
