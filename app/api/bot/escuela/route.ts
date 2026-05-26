import { NextResponse } from 'next/server'

const data = {
  ok: true,
  actualizado: '2026-05-25',
  version: '1.0',
  instrucciones_bot:
    'Usa esta información para responder preguntas sobre el Instituto San Ángel. Sé amable, profesional y responde en español. Si no tienes la información solicitada, invita al usuario a llamar o enviar WhatsApp.',

  instituto: {
    nombre: 'Instituto San Ángel',
    slogan: 'Educación de Excelencia',
    fundacion: 1993,
    trayectoria: 'Más de 30 años formando líderes',
    tipo: 'Institución educativa privada',
    incorporacion: 'SEP — RVOE clave 09PBH0001X',
    modalidad: 'Escolarizado presencial',
    idioma_principal: 'Español',
    segundo_idioma: 'Inglés (programa intensivo bilingüe)',
    descripcion:
      'El Instituto San Ángel es una institución educativa privada con más de 30 años de trayectoria en la Ciudad de México. Ofrecemos educación de excelencia en tres niveles: Primaria, Secundaria y Preparatoria. Nuestro modelo pedagógico combina sólidos valores humanos con innovación tecnológica y preparación para el mundo globalizado.',
    mision:
      'Formar personas íntegras con excelencia académica, valores sólidos y habilidades del siglo XXI, capaces de contribuir positivamente a la sociedad.',
    vision:
      'Ser la institución educativa de referencia en la Ciudad de México, reconocida por la calidad de sus egresados y su compromiso con la innovación pedagógica.',
    valores: ['Integridad', 'Respeto', 'Innovación', 'Responsabilidad', 'Excelencia', 'Solidaridad'],
  },

  contacto: {
    direccion: 'Av. Insurgentes Sur 1234, Col. San Ángel, Álvaro Obregón, CDMX, C.P. 01000',
    telefono: '(55) 1234-5678',
    telefono_secundario: '(55) 8765-4321',
    whatsapp: '+525512345678',
    email_admisiones: 'admisiones@institutosanangel.edu.mx',
    email_general: 'contacto@institutosanangel.edu.mx',
    horario_oficina: 'Lunes a Viernes de 7:30 a 16:00 hrs',
    horario_whatsapp: 'Lunes a Viernes de 8:00 a 18:00 hrs, Sábados de 9:00 a 13:00 hrs',
    redes_sociales: {
      facebook: 'facebook.com/institutosanangel',
      instagram: '@institutosanangel',
      youtube: 'youtube.com/institutosanangel',
    },
  },

  estadisticas: {
    total_alumnos: 1200,
    docentes_certificados: 120,
    tasa_ingreso_universidad: '95%',
    promedio_egreso_preparatoria: 4.2,
    grupos_por_nivel: 6,
    alumnos_maximos_por_grupo: 30,
  },

  niveles: [
    {
      id: 'primaria',
      nombre: 'Primaria',
      nivel_sep: 'Educación Primaria',
      grados: '1° a 6° grado',
      duracion: '6 años',
      edad_ingreso: '6 años cumplidos antes del 31 de diciembre',
      rango_edad: '6 a 12 años',
      horario: '7:30 – 14:30 hrs',
      horario_extendido: 'Hasta 17:00 hrs (servicio opcional con costo adicional)',
      alumnos_por_grupo: 25,
      colegiatura_mensual: '$3,500 MXN',
      inscripcion_anual: '$6,000 MXN',
      descripcion:
        'Nuestra Primaria ofrece una educación integral basada en el modelo ABP (Aprendizaje Basado en Proyectos). Grupos reducidos de máximo 25 alumnos garantizan atención personalizada. Los primeros tres grados cuentan con docente y asistente en aula.',
      enfoque_pedagogico:
        'Aprendizaje Basado en Proyectos (ABP). Los alumnos desarrollan proyectos interdisciplinarios y los presentan ante la comunidad escolar cada semestre.',
      materias: [
        'Español y Lectura',
        'Matemáticas',
        'Ciencias Naturales',
        'Historia',
        'Geografía',
        'Inglés intensivo',
        'Educación Física',
        'Arte y Música',
        'Tecnología e Informática',
        'Cívica y Ética',
      ],
      actividades_extracurriculares: [
        'Coro escolar y banda musical',
        'Taller de artes plásticas',
        'Deportes (fútbol, básquetbol, volibol)',
        'Club de inglés conversacional',
        'Robótica y programación',
        'Club lector',
      ],
      caracteristicas_destacadas: [
        'Programa bilingüe desde 1er grado',
        'Evaluación formativa continua (sin exámenes memorísticos)',
        'Programa certificado contra el acoso escolar (bullying)',
        'Viajes de estudio anuales por grado',
        'App de comunicación directa con padres de familia',
        'Nutriólogo en campus para supervisión del comedor',
      ],
      servicios_incluidos: [
        'Seguro de accidentes escolar',
        'Biblioteca física y digital',
        'Acceso a plataforma educativa en línea',
      ],
    },
    {
      id: 'secundaria',
      nombre: 'Secundaria',
      nivel_sep: 'Educación Secundaria',
      grados: '1° a 3° grado',
      duracion: '3 años',
      edad_ingreso: 'Haber concluido Primaria (aprox. 12 años)',
      rango_edad: '12 a 15 años',
      horario: '7:00 – 15:00 hrs',
      alumnos_por_grupo: 30,
      colegiatura_mensual: '$4,200 MXN',
      inscripcion_anual: '$7,500 MXN',
      descripcion:
        'La Secundaria del Instituto San Ángel combina rigor académico con orientación vocacional temprana. Desde 2° grado los alumnos participan en talleres vocacionales y visitas a universidades. El 100% de nuestros egresados de secundaria continúan hacia la preparatoria.',
      enfoque_pedagogico:
        'Aprendizaje activo con proyectos STEM, talleres especializados y mentoría individual. Cada alumno cuenta con un asesor académico durante los 3 años.',
      materias: [
        'Español',
        'Literatura',
        'Inglés avanzado',
        'Matemáticas',
        'Álgebra',
        'Geometría',
        'Biología',
        'Química',
        'Física',
        'Historia Universal',
        'Historia de México',
        'Geografía',
        'Cívica y Ética',
        'Computación y Programación',
        'Artes',
        'Educación Física',
      ],
      programas_especiales: [
        'Laboratorio de Ciencias — prácticas semanales',
        'Coding & STEM — Python, Scratch, Arduino',
        'Taller de escritura creativa y debate',
        'Preparación para Olimpiadas académicas (Matemáticas, Química, Español)',
      ],
      certificaciones_disponibles: [
        'Cambridge English A2–B1',
        'Microsoft Office Specialist',
        'Primeros Auxilios (Cruz Roja)',
      ],
      orientacion_vocacional:
        'Desde 2° grado: talleres vocacionales, visitas a universidades, test de aptitudes y sesiones con orientador certificado.',
      caracteristicas_destacadas: [
        'Mentoría académica individual los 3 años',
        'Grupos máximo 30 alumnos',
        '100% pase a Preparatoria',
        'Olimpiadas académicas regionales y nacionales',
        'Plataforma e-learning disponible 24/7',
      ],
    },
    {
      id: 'preparatoria',
      nombre: 'Preparatoria',
      nivel_sep: 'Nivel Medio Superior',
      sistema: 'Incorporado SEP-UNAM',
      grados: '1° a 3° año',
      duracion: '3 años',
      edad_ingreso: 'Haber concluido Secundaria (aprox. 15 años)',
      rango_edad: '15 a 18 años',
      horario: '7:00 – 15:30 hrs',
      alumnos_por_grupo: 30,
      colegiatura_mensual: '$5,800 MXN',
      inscripcion_anual: '$9,500 MXN',
      descripcion:
        'Nuestra Preparatoria está incorporada al sistema SEP-UNAM, lo que garantiza validez oficial y un plan de estudios de alto nivel. El 95% de nuestros egresados ingresan a la universidad de su primera opción.',
      bachilleratos: [
        {
          id: 'ciencias-naturales',
          nombre: 'Ciencias Naturales y Salud',
          enfoque: 'Biología, Química y Física. Ideal para Medicina, Ingeniería, Bioquímica.',
          materias_especializadas: ['Biología Avanzada', 'Química Orgánica', 'Física', 'Cálculo'],
        },
        {
          id: 'economico-administrativo',
          nombre: 'Económico-Administrativo',
          enfoque: 'Matemáticas financieras, Economía, Contabilidad. Ideal para Negocios, Derecho, Economía.',
          materias_especializadas: ['Matemáticas Financieras', 'Economía', 'Contabilidad', 'Estadística'],
        },
        {
          id: 'tecnologia-informatica',
          nombre: 'Tecnología e Informática',
          enfoque: 'Programación avanzada, IA, Redes. Ideal para Ingeniería en Sistemas, Ciberseguridad.',
          materias_especializadas: ['Python Avanzado', 'Bases de Datos', 'Inteligencia Artificial', 'Redes'],
        },
        {
          id: 'humanidades',
          nombre: 'Humanidades y Comunicación',
          enfoque: 'Filosofía, Sociología, Comunicación. Ideal para Periodismo, Diseño, Ciencias Sociales.',
          materias_especializadas: ['Filosofía', 'Sociología', 'Literatura', 'Comunicación Visual'],
        },
      ],
      servicios_adicionales: [
        'Cursos intensivos COMIPEMS/EXANI-I incluidos en colegiatura',
        'Simulacros mensuales desde 2° año',
        'Servicio de psicología escolar',
        'Intercambios internacionales (EE.UU., Canadá, España)',
        'Bolsa de trabajo y prácticas profesionales',
        'Plataforma e-learning 24/7',
        'Titulación por promedio (sin presentar examen)',
      ],
      estadisticas: {
        ingreso_primera_opcion: '95%',
        promedio_egreso: 4.2,
        convenios_universitarios: 15,
      },
      universidades_socias: [
        'UNAM', 'IPN', 'UAM', 'Tec de Monterrey',
        'Universidad Iberoamericana', 'ITAM', 'Anáhuac', 'UIA',
      ],
    },
  ],

  instalaciones: [
    { nombre: 'Laboratorios', detalle: '3 laboratorios (Física, Química, Biología) con certificación de seguridad' },
    { nombre: 'Tecnología', detalle: 'WiFi en campus completo, 2 salas de cómputo con 40 equipos c/u, pizarrones interactivos' },
    { nombre: 'Áreas deportivas', detalle: 'Canchas de fútbol, básquetbol, volibol y pista atlética de 400 m en 4 hectáreas' },
    { nombre: 'Comedor', detalle: 'Menú balanceado supervisado por nutriólogo. Opciones veganas y alergias alimentarias' },
    { nombre: 'Transporte escolar', detalle: 'Rutas con GPS en tiempo real y vigilancia. Cobertura zona metropolitana CDMX' },
    { nombre: 'Seguridad', detalle: 'CCTV en todas las instalaciones, control de acceso biométrico, protocolos de emergencia' },
    { nombre: 'Biblioteca', detalle: 'Biblioteca física y digital con más de 10,000 títulos y acceso a bases de datos académicas' },
    { nombre: 'Auditorio', detalle: 'Auditorio con capacidad para 500 personas, equipado con sistema de audio y proyección' },
  ],

  admision: {
    descripcion: 'El proceso de admisión es sencillo y puede iniciarse en cualquier momento del año. Las inscripciones formales abren en enero para el ciclo escolar siguiente.',
    periodo_inscripciones: 'Enero – Junio (para ciclo escolar septiembre–agosto)',
    pasos: [
      'Solicitar informes vía WhatsApp, teléfono o correo electrónico',
      'Agendar visita guiada gratuita al campus',
      'Presentar documentación requerida',
      'Evaluación diagnóstica (sin costo, no es de admisión)',
      'Entrevista con el nivel educativo correspondiente',
      'Firmar contrato de prestación de servicios',
      'Pagar inscripción para asegurar lugar',
    ],
    documentos_requeridos: [
      'Acta de nacimiento (original y copia)',
      'CURP',
      'Certificado o constancia del nivel anterior (boleta de calificaciones)',
      'Carta de buena conducta (nivel secundaria y preparatoria)',
      '4 fotografías tamaño infantil',
      'Comprobante de domicilio reciente',
      'Identificación oficial de los padres/tutores',
    ],
    becas: 'Contamos con un programa de becas por excelencia académica y becas socioeconómicas. Preguntar al área de admisiones.',
    visita_guiada: 'Gratuita, sin compromiso. Incluye recorrido por instalaciones y sesión informativa con director de nivel.',
  },

  preguntas_frecuentes: [
    {
      pregunta: '¿Cuánto cuesta la colegiatura?',
      respuesta: 'Primaria: $3,500/mes. Secundaria: $4,200/mes. Preparatoria: $5,800/mes. La inscripción anual es de $6,000, $7,500 y $9,500 respectivamente. Los precios incluyen acceso a plataforma digital, seguro escolar y biblioteca.',
    },
    {
      pregunta: '¿Cuándo puedo inscribir a mi hijo?',
      respuesta: 'Las inscripciones formales abren en enero para el ciclo escolar que inicia en septiembre. Sin embargo, aceptamos alumnos durante todo el año si hay lugares disponibles. Te recomendamos contactarnos cuanto antes para asegurar el lugar.',
    },
    {
      pregunta: '¿El colegio tiene servicio de transporte?',
      respuesta: 'Sí, contamos con transporte escolar con rutas en toda la zona metropolitana de la CDMX. Cada unidad tiene GPS rastreable en tiempo real por los padres y personal de vigilancia. El costo es adicional a la colegiatura; consultar rutas disponibles.',
    },
    {
      pregunta: '¿Tienen programa bilingüe?',
      respuesta: 'Sí. El inglés se imparte desde 1er grado de Primaria con metodología comunicativa. En Secundaria y Preparatoria contamos con certificaciones Cambridge disponibles. En Preparatoria ofrecemos materias parcialmente en inglés.',
    },
    {
      pregunta: '¿Qué pasa si mi hijo tiene dificultades de aprendizaje?',
      respuesta: 'Contamos con servicio de psicología y orientación educativa. Se realiza una evaluación para diseñar un plan de apoyo personalizado. Trabajamos en conjunto con los padres de familia.',
    },
    {
      pregunta: '¿Cómo es el proceso de admisión?',
      respuesta: 'Es muy sencillo: primero agendan una visita guiada gratuita, luego presentan documentos y se realiza una evaluación diagnóstica (no eliminatoria). No es examen de admisión, sino un diagnóstico para conocer el nivel del alumno.',
    },
    {
      pregunta: '¿Ofrecen becas?',
      respuesta: 'Sí, contamos con becas por excelencia académica (para alumnos con promedio de 9.5 o superior) y becas socioeconómicas sujetas a estudio. Comunicarse con el área de admisiones para más información.',
    },
    {
      pregunta: '¿La preparatoria tiene validez oficial?',
      respuesta: 'Sí. Nuestra Preparatoria está incorporada al sistema SEP-UNAM, lo que garantiza validez oficial en todo el país y reconocimiento por todas las universidades.',
    },
    {
      pregunta: '¿Tienen comedor?',
      respuesta: 'Sí. El comedor ofrece menú balanceado supervisado por nutriólogo, con opciones para alergias alimentarias y dieta vegana. Hay opción de contratar el servicio de comedor de forma mensual.',
    },
    {
      pregunta: '¿Cuál es el horario escolar?',
      respuesta: 'Primaria: 7:30 – 14:30 hrs (extensión opcional hasta 17:00 hrs). Secundaria: 7:00 – 15:00 hrs. Preparatoria: 7:00 – 15:30 hrs. Las oficinas administrativas atienden de 7:30 a 16:00 hrs.',
    },
  ],
}

export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
