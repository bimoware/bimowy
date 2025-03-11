import { useEffect, useMemo, useState } from 'react'
import LoadingIcon from '../components/LoadingIcon'
import ConditionalHref from '../components/ConditionalHref'

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



interface CardProps {
  title: string
  content: string
  href?: string
}

export function Card({ title, content, href }: CardProps) {
  const rotationClasses = [
    'hover:rotate-1',
    'hover:-rotate-1',
    'hover:rotate-2',
    'hover:-rotate-2',
    'hover:rotate-3',
    'hover:-rotate-3',
  ]

  const translationXClasses = [
    'hover:translate-x-0',
    'hover:translate-x-1',
    'hover:-translate-x-1',
    'hover:translate-x-2',
    'hover:-translate-x-2',
  ]
  const translationYClasses = [
    'hover:translate-y-0',
    'hover:translate-y-1',
    'hover:-translate-y-1',
    'hover:translate-y-2',
    'hover:-translate-y-2',
  ]

  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const randomRotationClass = useMemo(() => {
    return [rotationClasses, translationXClasses, translationYClasses].map(randomFrom)
  }, [])

  return (
    <ConditionalHref href={href}>
      <div
        className={`w-70 bg-neutral-700/20 p-4 rounded-xl
      flex flex-col self-center h-fit
      transition cursor-pointer
      hover:ring-2 hover:scale-105
      ${randomRotationClass.join(' ')}
      hover:shadow-2xl shadow-black
      inset-shadow-xs inset-shadow-white/5
      select-none`}
      >
        <h4 className='self-center text-big'>{title}</h4>
        <span className='text-basic'>{content}</span>
      </div>
    </ConditionalHref>
  )
}
