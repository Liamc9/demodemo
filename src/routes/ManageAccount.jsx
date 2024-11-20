// IMPORTS
import { useState, useEffect } from 'react'
import { ManageAccount } from 'liamc9npm'
// CREATE FUNCTION
export default function ManageAccountPage() {
    // STATE VARIABLES
    const [state, setState] = useState(0)


    // HTML
    return (
        <>
            <head></head>
            <body className='m-20'>
                <ManageAccount />
            </body>
        </>
    )
}