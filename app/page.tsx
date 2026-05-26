import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Nosotros from './components/Nosotros'
import Primaria from './components/Primaria'
import Secundaria from './components/Secundaria'
import Preparatoria from './components/Preparatoria'
import Instalaciones from './components/Instalaciones'
import Testimonials from './components/Testimonials'
import Contacto from './components/Contacto'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Nosotros />
      <Primaria />
      <Secundaria />
      <Preparatoria />
      <Instalaciones />
      <Testimonials />
      <Contacto />
      <Footer />
    </main>
  )
}
