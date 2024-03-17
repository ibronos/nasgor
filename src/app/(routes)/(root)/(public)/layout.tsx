import 'bootstrap/dist/css/bootstrap.css'
import './frontend.scss'
import Header from "./header";
import Footer from "./footer";

export default function Public({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <Header /> 
          <main className='content'>
            {children}
          </main>
        <Footer />
      </>
    )
  }