import 'bootstrap/dist/css/bootstrap.css'

export default function Public({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <main className='content admin-login'>
          {children}
        </main>
      </>
    )
  }