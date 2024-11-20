// IMPORTS
import { useState, useEffect } from 'react'
import { ManagePaymentMethods } from 'liamc9npm'
// CREATE FUNCTION
export default function ManagePaymentMethodsPage() {
    // STATE VARIABLES
    const [state, setState] = useState(0)

    // JAVASCRIPT LOGIC
    const paymentMethods = [
        { name: 'Visa **** 1234' },
        { name: 'MasterCard **** 5678' },
        { name: 'PayPal' },
      ];
      

    // HTML
    return (
        <>
            <head></head>
            <body className='m-20'>
            <ManagePaymentMethods
        paymentMethods={paymentMethods}
        onAddPaymentMethod={() => console.log('Add Payment Method Clicked')}
      />;

            </body>
        </>
    )
}