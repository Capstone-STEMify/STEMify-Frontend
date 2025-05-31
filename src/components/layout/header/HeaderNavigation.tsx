import { Button } from '@/components/shadcn/button'
import LinkButton from '@/components/shared/LinkButton'

export default function HeaderNavigation() {
  return (
    <nav>
      <ul className='justify- flex items-center gap-1'>
        {/* Resource */}
        <li>
          <LinkButton
            href='/student/profile'
            variant='ghost'
            className='hover:bg-amber-custom-100 relative h-10 w-fit p-3 transition-colors duration-200 hover:text-amber-600'
          >
            Resource
          </LinkButton>
        </li>

        {/* Classroom */}
        <li>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-amber-custom-100 relative h-10 w-fit p-3 transition-colors duration-200 hover:text-amber-600'
          >
            Classroom
          </Button>
        </li>

        {/* STEM */}
        <li>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-amber-custom-100 relative h-10 w-fit p-3 transition-colors duration-200 hover:text-amber-600'
          >
            STEM
          </Button>
        </li>

        {/* Project */}
        <li>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-amber-custom-100 h-10 w-fit p-3 transition-colors duration-200 hover:text-amber-600'
          >
            Project
          </Button>
        </li>
      </ul>
    </nav>
  )
}
