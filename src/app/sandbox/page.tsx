'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ExercisesAllRouteResult } from '@app/api/exercises/all/route'
import { CardLister, Card } from '@cpn/Card'

export default function ExercisesPage() {
  const t = useTranslations('SandboxPage')
  const locale = useLocale()
  const [exercises, setExercises] = useState<ExercisesAllRouteResult>()

  useEffect(() => {
    fetch(`/api/exercises/all?lang=${locale}`)
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ExercisesAllRouteResult) => setExercises(data))
  }, [])

  return <CardLister title={t('sandbox')}>
    {
      exercises
        ? exercises.map((exercise, index) => (
          <Card key={exercise.id} id={exercise.id} data={{ ...exercise, href: "/sandbox/" + exercise.id }} />
        ))
        :
        Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} skeleton id={String(i)} />
        ))
    }
  </CardLister>
}