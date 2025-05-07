import React from 'react'

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode}>) {
  return (
    <div className='flex flex-col bg-black'>
            {/* <Header /> */}
      <main className=''>{children}</main>
      {/* <Footer /> */}

    </div>
  )
}
