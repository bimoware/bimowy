'use client'

import { Bloc } from '@cpn/Bloc'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function SideBar() {
  return (
    <Bloc type='sidebar'>
      {[
        {
          id: 'home',
          data: {
            icon: '/svgs/home.svg',
            path: '',
            label: 'Home'
          }
        },
        {
          id: 'ex',
          data: {
            icon: '/svgs/exercises.svg',
            path: 'exercises',
            label: 'Exercises'
          }
        },
        {
          id: "lessons",
          data: {
            beta: true,
            icon: '/svgs/lesson.svg',
            path: 'lessons',
            label: 'Lessons'
          }
        },
        {
          id: "favorites",
          data: {
            beta: true,
            icon: '/svgs/bookmark.svg',
            path: 'favorites',
            label: 'Favorites'
          }
        }
      ].map((btn) => (
        <SideBarIcon {...btn.data} key={btn.id} />
      ))}
    </Bloc>
  )
}

function SideBarIcon({
  icon,
  path,
  label,
  beta
}: {
  icon: string
  path: string
  label: string
  beta?: boolean
}) {
  const pathname = usePathname().split('/')[1] || '' // Get the current path without the leading slash (/exercices/add -> exercices)
  const isActive = pathname === path // Check if the current path matches the icon's path

  const myDiv = (
    <div
      className={`aspect-square rounded-xl p-2 m-1
        duration-150 hover:translate-x-1 hover:scale-105
            ${beta ? "!opacity-40" : ""}
            ${isActive
          ? 'bg-neutral-50/5'
          : 'hover:bg-neutral-50/5 opacity-90'
        }
            `}
    >
      <Image
        src={icon}
        alt={label}
        width={30}
        height={30}
      />
    </div>
  )

  return <Link href={`/${path}`}>{myDiv}</Link>
}
