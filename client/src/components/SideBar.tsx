import PageSection from './PageSection'
import SideBarIcon from './SideBarIcon'

import testIcon from '/svgs/test.svg'
import subjectIcon from '/svgs/subject.svg'

import TestPage from '../pages/TestPage'
import SubjectsPage from '../pages/RessourcesPage'

const routes = [
  {
    id: 'test',
    element: <TestPage />,
    icon: testIcon,
    href: '/',
  },
  {
    id: 'subjects',
    elements: <SubjectsPage />,
    icon: subjectIcon,
  },
].map((route) => ({ ...route, href: route.href || '/' + route.id }))

export default function SideBar() {
  const currentPath = window.location.pathname
  return (
    <PageSection className='flex flex-col gap-3 min-w-17'>
      {routes.map(({ id, icon, href }) => (
        <SideBarIcon {...{ id, icon, currentPath, href }} key={id} />
      ))}
    </PageSection>
  )
}
