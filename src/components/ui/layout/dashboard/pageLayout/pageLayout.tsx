import React from 'react'

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='px-6 py-10 md:px-8 md:py-12 space-y-2'>{children}</section>
  )
}