'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function SideBar() {
  return (
    <div className='w-24 h-full p-4 flex flex-col justify-between shrink-0 gap-4'>
      <div className='bg-neutral-900 p-1 w-full h-fit
    rounded-3xl
    overflow-y-auto
    flex flex-col items-center'>
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
            id: "discover",
            data: {
              beta: true,
              icon: '/svgs/path.svg',
              path: 'discover',
              label: 'Discover'
            }
          },
          {
            id: 'sandbox',
            data: {
              icon: '/svgs/sandbox.svg',
              path: 'sandbox',
              label: 'Sandbox'
            }
          },
          {
            id: 'draft',
            data: {
              beta: true,
              icon: '/svgs/draft.svg',
              path: 'draft',
              label: 'Draft'
            }
          },

          {
            id: 'health',
            data: {
              beta: true,
              icon: '/svgs/health.svg',
              path: 'health',
              label: 'Health'
            }
          }
        ].map((btn) => (
          <SideBarIcon {...btn.data} key={btn.id} />
        ))}
      </div>
      <div className='bg-neutral-900 p-2 w-full h-fit
      rounded-3xl
      overflow-y-auto
      flex flex-col items-center'>
        {[
          {
            id: "progress",
            data: {
              beta: true,
              icon: '/svgs/progress.svg',
              path: 'progress',
              label: 'Progress'
            }
          },
          // {
          //   id: "history",
          //   data: {
          //     beta: true,
          //     icon: '/svgs/history.svg',
          //     path: 'history',
          //     label: 'History'
          //   }
          // },
          {
            id: 'login',
            data: {
              beta: true,
              icon: '/svgs/login.svg',
              path: 'login',
              label: 'Login'
            }
          },
          {
            id: 'settings',
            data: {
              beta: true,
              icon: '/svgs/settings.svg',
              path: 'settings',
              label: 'Settings'
            }
          }
        ].map((btn) => (
          <SideBarIcon {...btn.data} key={btn.id} />
        ))}
      </div>
    </div>
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
        duration-150 hover:translate-x-0.5 hover:scale-105
            ${beta
          ? "!opacity-30 cursor-not-allowed"
          : isActive
            ? 'bg-neutral-50/5'
            : 'hover:bg-neutral-50/5 opacity-90'
        }
          group`}
    >
      <Image
        className='group-hover:rotate-2 group-hover:scale-110 duration-150'
        src={icon}
        alt={label}
        width={30}
        height={30}
      />
    </div>
  )

  return <Link href={`/${path}`}>{myDiv}</Link>
}
