import { FlaskConical, Code2, BookMarked, Trophy, Users, ArrowRight } from 'lucide-react'

const programas = [
  {
    icon: FlaskConical,
    title: 'Laboratorio de Ciencias',
    desc: 'Prácticas semanales en laboratorio equipado con instrumental de nivel universitario.',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    icon: Code2,
    title: 'Coding & STEM',
    desc: 'Programación en Scratch, Python y proyectos de electrónica con Arduino.',
    color: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    icon: BookMarked,
    title: 'Taller de escritura',
    desc: 'Desarrollo de habilidades comunicativas, redacción creativa y debate.',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    icon: Trophy,
    title: 'Olimpiadas académicas',
    desc: 'Preparación y participación en olimpiadas de matemáticas, química y español.',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
  },
]

const materias = [
  ['Matemáticas', 'Álgebra', 'Geometría'],
  ['Español', 'Literatura', 'Inglés avanzado'],
  ['Biología', 'Química', 'Física'],
  ['Historia', 'Geografía', 'Cívica y Ética'],
  ['Computación', 'Artes', 'Ed. Física'],
]

export default function Secundaria() {
  return (
    <section id="secundaria" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            Nivel Medio · 1° a 3° grado
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            Secundaria{' '}
            <span className="text-blue-700">— Potencia tu talento</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Edad: 12 a 15 años. Horario 7:00 – 15:00 hrs. Formación integral que combina
            rigor académico con desarrollo personal y vocacional.
          </p>
        </div>

        {/* Programs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {programas.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className={`rounded-2xl border p-6 hover:shadow-md transition-shadow ${color}`}
            >
              <Icon className="w-8 h-8 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Materias + social */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Materias */}
          <div className="bg-blue-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Plan de estudios</h3>
            <div className="space-y-3">
              {materias.map((row, i) => (
                <div key={i} className="flex flex-wrap gap-2">
                  {row.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-100"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '30', label: 'Alumnos máx. por grupo' },
                { value: '6', label: 'Talleres disponibles' },
                { value: '100%', label: 'Pase a preparatoria' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-amber-400">{value}</div>
                  <div className="text-xs text-blue-300 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Desarrollo personal */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">Orientación vocacional</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Desde 2° grado, los alumnos participan en talleres vocacionales y
                visitas a universidades para descubrir sus áreas de interés y tomar
                decisiones informadas sobre su preparatoria.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Certificaciones disponibles</h3>
              <ul className="space-y-3">
                {[
                  'Cambridge English (A2–B1)',
                  'Microsoft Office Specialist',
                  'Primeros Auxilios Cruz Roja',
                ].map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-gray-700">
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <p className="text-blue-800 text-sm font-medium leading-relaxed">
                <strong>Programa de mentoría:</strong> cada estudiante cuenta con un
                asesor académico que le acompaña durante los 3 años y coordina con
                padres de familia para garantizar su avance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
