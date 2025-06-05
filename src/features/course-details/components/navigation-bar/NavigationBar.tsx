import React from 'react'

interface NavigationBarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skill', label: 'Skill' },
    { id: 'courses', label: 'Content' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'suggestions', label: 'Suggestions' }
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className='top-0 z-50'>
      <div className='mx-auto max-w-7xl border-b'>
        <nav className='flex space-x-8 overflow-x-auto'>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`border-b-2 px-2 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeSection === item.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default NavigationBar
