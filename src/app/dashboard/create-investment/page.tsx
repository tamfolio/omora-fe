import CreateInvestmentMultiStepForm from '@/components/investment/CreateInestmentMultistepForm'
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function page() {
  return (
     <ProtectedRoute>
    <div>
      <CreateInvestmentMultiStepForm />
    </div>
    </ProtectedRoute>
  )
}
