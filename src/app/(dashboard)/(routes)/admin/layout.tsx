"use client"

import { useState, useEffect } from "react";


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const loader = document.getElementById('content');
          if (loader)
          setIsLoading(false);
        }
      }, []);

    if (isLoading) { 
        return <p className="container-fluid py-4">Loading...</p> 
    };

    return (
        <>
            {children}
        </>
         
    )
  }