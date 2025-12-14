import React from 'react'

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='px-8 py-12 space-y-2'>{children}</section>
  )
}