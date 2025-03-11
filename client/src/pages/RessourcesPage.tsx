import { useEffect, useState } from 'react'
import LoadingIcon from '../components/LoadingIcon'
import { Card } from './DashboardPage'

type subject = {
  name: string
  id: string
  desc: string
}

export default function RessourcesPage() {
  const [data, setData] = useState<subject[]>([])

  useEffect(() => {
    fetch('http://localhost:1230/api/ressources')
      .then((res) => res.json())
      .then((data: subject[]) => setData(data))
  }, [])

  return !data.length ? (
    <LoadingIcon />
  ) : (
    <div className='flex gap-4'>
      {data.map((subject) => (
        <Card
          href={`/exercice/${subject.id}`}
          key={subject.id}
          title={subject.name}
          content={subject.desc}
        />
      ))}
    </div>
  )
}
