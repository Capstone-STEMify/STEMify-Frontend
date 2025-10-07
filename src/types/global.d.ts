import * as React from 'react'

declare global {
  namespace React {
    type ReactSVG = JSX.IntrinsicElements
  }
  namespace JSX {
    type Element = React.JSX.Element
    type IntrinsicElements = React.JSX.IntrinsicElements
  }
}
