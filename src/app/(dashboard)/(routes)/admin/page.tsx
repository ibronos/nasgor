import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'admin',
  description: 'admin',
}

export default function admin() {
  return (
    <div className="container-fluid main-content">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>
  </div> 
  )
}
