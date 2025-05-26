import React from 'react'
import { Toaster } from 'react-hot-toast'

const Toast = () => {
  return (
    <div>
        <Toaster    position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: '80px', // This will push notifications below navbar
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}/>
    </div>
  )
}

export default Toast