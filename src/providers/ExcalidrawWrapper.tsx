'use client'
import { Excalidraw, Footer, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useState } from 'react'

const ExcalidrawWrapper: React.FC = () => {
  const [docked, setDocked] = useState(false)

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Excalidraw
        UIOptions={{
          // this effectively makes the sidebar dockable on any screen size,
          // ignoring if it fits or not
          dockedSidebarBreakpoint: 0
        }}
      >
        <WelcomeScreen />
        <MainMenu>
          <MainMenu.ItemLink href="https://google.com">Google</MainMenu.ItemLink>
          <MainMenu.ItemLink href="https://excalidraw.com">Excalidraw</MainMenu.ItemLink>
          <MainMenu.ItemLink href="http://localhost:3000">STEMify</MainMenu.ItemLink>
        </MainMenu>
        <Footer>
          <button className="" onClick={() => alert('Saved!')}>
            Save
          </button>
        </Footer>
      </Excalidraw>
    </div>
  )
}

export default ExcalidrawWrapper
