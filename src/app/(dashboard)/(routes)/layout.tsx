"use client"

import '../../../../public/sb-admin/css/fontawesome-all.min.css'
import '../../../../public/sb-admin/css/sb-admin-2.min.css'
import './admin.scss'
import { Inter } from 'next/font/google'
import Navbar from './navbar'
import Topbar from './topbar'
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
      <SessionProvider>
        <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content" className="pb-5">
              <Topbar />
              {children}
            </div>
            <footer className="sticky-footer bg-white">
              <div className="container my-auto">
                <div className="copyright text-center my-auto">
                  <span>Copyright © Your Website</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SessionProvider>
  )
}
