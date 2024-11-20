// IMPORTS
import { useState, useEffect } from 'react'
import { ImageCarousel } from 'liamc9npm'

// CREATE FUNCTION
export default function DisplayPage() {
    // STATE VARIABLES
    const [state, setState] = useState(0)

    // HTML
    return (
        <>
            <head></head>
            <body>
            <ImageCarousel
    images={[
      'https://via.placeholder.com/800x400?text=Slide+1',
      'https://via.placeholder.com/800x400?text=Slide+2',
      'https://via.placeholder.com/800x400?text=Slide+3',
    ]}
  />
            </body>
        </>
    )
}