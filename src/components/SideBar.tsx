'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type IconObj = {
  id: string,
  data: {
    icon: string, path: string, label: string, beta?: true
  }
}
export default function SideBar() {
  return (
    <div className='w-16 h-full flex flex-col justify-between shrink-0 gap-4'>
      <section className='bg-neutral-900 p-1.5 h-fit flex flex-col items-center'>
        {([
          {
            id: 'home',
            data: {
              icon: '/svgs/home.svg',
              path: '',
              label: 'Home'
            }
          },
          {
            id: "cheat_sheet",
            data: {
              beta: true,
              icon: '/svgs/cheat_sheet.svg',
              path: 'cheatsheet',
              label: 'Cheat Sheets'
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
            id: "progress",
            data: {
              beta: true,
              icon: '/svgs/progress.svg',
              path: 'progress',
              label: 'Progress'
            }
          }
        ] as IconObj[]).map((btn) => <SideBarIcon {...btn.data} key={btn.id} />)}
      </section>
      <section className='bg-neutral-900 p-1.5 h-fit flex flex-col items-center'>
        {([
          {
            id: 'credits',
            data: {
              icon: '/svgs/code.svg',
              path: 'credits',
              label: 'Credits'
            }
          },
          {
            id: 'login',
            data: {
              beta: true,
              icon: '/svgs/login.svg',
              path: 'login',
              label: 'Login'
            }
          },
        ] as IconObj[]).map((btn) => <SideBarIcon {...btn.data} key={btn.id} />)}
      </section>
    </div >
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
            : 'hover:bg-neutral-50/5 opacity-70'
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
