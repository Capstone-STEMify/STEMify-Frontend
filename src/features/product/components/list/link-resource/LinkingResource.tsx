import React from 'react'

const RichResources: React.FC = () => {
  const resources = [
    {
      title: 'Software',
      description: 'Transform your ideas into captivating real-life projects effortlessly with easy-to-use software.',
      imageSrc: 'https://i.imgur.com/k6lPqS2.jpg',
      linkText: 'Learn More >'
    },
    {
      title: 'Lessons & Cases',
      description: 'Transform your ideas into captivating real-life projects effortlessly with easy-to-use software.',
      imageSrc: 'https://i.imgur.com/JbW7N7R.jpg',
      linkText: 'Get Resources >'
    },
    {
      title: 'Projects',
      description: 'Get inspiration today with our how-to tutorials to lessen your stress out of prep.',
      imageSrc: 'https://i.imgur.com/2Yc5R7g.jpg',
      linkText: 'Learn More >'
    }
  ]

  const ResourceCard: React.FC<(typeof resources)[0]> = ({ title, description, imageSrc, linkText }) => (
    <div className='flex flex-col rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl'>
      <div className='relative h-64 overflow-hidden rounded-t-xl'>
        <img
          src={imageSrc}
          alt={title}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>

      <div className='p-6'>
        <h3 className='mb-2 text-2xl font-bold text-gray-900'>{title}</h3>
        <p className='mb-4 line-clamp-3 h-14 text-gray-600'>{description}</p>{' '}
        <a href='#' className='text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800'>
          {linkText}
        </a>
      </div>
    </div>
  )

  return (
    <div className='container mx-auto bg-gray-50 px-4 py-12 sm:py-20'>
      <h2 className='mb-12 text-center text-4xl font-extrabold text-gray-900 sm:mb-16 sm:text-5xl'>
        Rich Resources for All Teaching Needs
      </h2>

      <div className='group grid grid-cols-1 gap-8 md:grid-cols-3'>
        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
    </div>
  )
}

export default RichResources
