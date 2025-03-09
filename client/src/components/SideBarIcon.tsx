interface SideBarIconProps {
  id: string
  icon: string
  currentPath: string
  href?: string
}

export default function SideBarIcon({ id, icon, currentPath, href }: SideBarIconProps) {
  const pathID = href || '/' + id
  const isSelected = currentPath === pathID
  return (
    <a href={pathID}>
      <div
        className={`p-2 rounded-xl duration-100 cursor-pointer 
            ${isSelected ? 'bg-white/5 scale-105' : 'hover:bg-white/5 hover:scale-105'}
            `}
      >
        <img src={icon} alt={id} className='w-8 aspect-square' />
      </div>
    </a>
  )
}
