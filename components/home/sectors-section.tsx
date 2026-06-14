import Image from "next/image"
import { Home, Building2, Factory, Tractor } from "lucide-react"

const sectors = [
  { icon: Home, title: "Residencial", desc: "Viviendas unifamiliares, edificios y condominios", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { icon: Building2, title: "Comercial", desc: "Locales, oficinas, centros comerciales", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
  { icon: Factory, title: "Industrial", desc: "Fábricas, plantas productivas, depósitos", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80" },
  { icon: Tractor, title: "Agropecuario", desc: "Establecimientos rurales, agroindustrias", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
]

export function SectorsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Sectores que Atendemos</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mt-3 mb-5">Experiencia en Múltiples Industrias</h2>
          <p className="text-slate-500 text-lg">Adaptamos nuestras soluciones a las necesidades específicas de cada sector</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((sector) => (
            <div key={sector.title} className="group relative h-72 rounded-3xl overflow-hidden">
              <Image src={sector.image} alt={sector.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition-all duration-500" />
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="w-11 h-11 rounded-xl bg-green-600/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-green-600 transition-colors duration-300">
                  <sector.icon className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{sector.title}</h3>
                <p className="text-slate-300 text-sm">{sector.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
