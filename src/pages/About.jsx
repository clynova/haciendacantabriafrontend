import React from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'


const About = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <Header />
            <main className="flex-grow w-full" style={{ marginTop: '6rem' }}>
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-4xl font-bold text-center text-slate-200">
                        About Us
                    </h1>
                </div>
            </main>
            <Footer />
        </div>
  )
}

export  {About}