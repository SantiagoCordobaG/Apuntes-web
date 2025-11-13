/**
 * Servicio de Etiquetado Automático de Documentos (Backend)
 * Versión simplificada para Node.js
 */

// Diccionario de palabras clave por área de conocimiento
const AREAS_CONOCIMIENTO = {
  matematicas: {
    keywords: ['matemáticas', 'matematicas', 'matematica', 'math', 'algebra', 'álgebra', 'geometria', 'geometría', 'calculo', 'cálculo', 'trigonometria', 'trigonometría', 'estadistica', 'estadística', 'probabilidad', 'ecuaciones', 'derivadas', 'integrales'],
    tags: ['matemáticas', 'cálculo', 'álgebra']
  },
  fisica: {
    keywords: ['física', 'fisica', 'physics', 'mecanica', 'mecánica', 'termodinamica', 'termodinámica', 'electromagnetismo', 'cuantica', 'cuántica', 'relatividad', 'optica', 'óptica', 'ondas'],
    tags: ['física', 'ciencia', 'experimental']
  },
  quimica: {
    keywords: ['química', 'quimica', 'chemistry', 'organica', 'orgánica', 'inorganica', 'inorgánica', 'bioquimica', 'bioquímica', 'reacciones', 'moleculas', 'moléculas', 'atomo', 'átomo'],
    tags: ['química', 'ciencia', 'laboratorio']
  },
  biologia: {
    keywords: ['biología', 'biologia', 'biology', 'celula', 'célula', 'genetica', 'genética', 'ecologia', 'ecología', 'anatomia', 'anatomía', 'fisiologia', 'fisiología', 'zoologia', 'zoología', 'botanica', 'botánica'],
    tags: ['biología', 'ciencia', 'naturaleza']
  },
  programacion: {
    keywords: ['programación', 'programacion', 'programming', 'codigo', 'código', 'algoritmo', 'software', 'desarrollo', 'javascript', 'python', 'java', 'html', 'css', 'react', 'vue', 'node', 'backend', 'frontend', 'api', 'base de datos', 'database'],
    tags: ['programación', 'informática', 'tecnología']
  },
  historia: {
    keywords: ['historia', 'history', 'historico', 'histórico', 'antigua', 'medieval', 'moderna', 'contemporanea', 'contemporánea', 'guerra', 'civilizacion', 'civilización', 'cultura', 'sociedad'],
    tags: ['historia', 'sociales', 'cultura']
  },
  literatura: {
    keywords: ['literatura', 'literature', 'poesia', 'poesía', 'novela', 'cuento', 'ensayo', 'drama', 'teatro', 'poema', 'escritura', 'autor', 'libro'],
    tags: ['literatura', 'humanidades', 'arte']
  },
  filosofia: {
    keywords: ['filosofía', 'filosofia', 'philosophy', 'etica', 'ética', 'moral', 'logica', 'lógica', 'metafisica', 'metafísica', 'epistemologia', 'epistemología'],
    tags: ['filosofía', 'humanidades', 'pensamiento']
  },
  economia: {
    keywords: ['economía', 'economia', 'economics', 'finanzas', 'mercado', 'comercio', 'negocios', 'empresa', 'marketing', 'contabilidad', 'macroeconomia', 'macroeconomía', 'microeconomia', 'microeconomía'],
    tags: ['economía', 'sociales', 'negocios']
  },
  psicologia: {
    keywords: ['psicología', 'psicologia', 'psychology', 'mental', 'comportamiento', 'cognicion', 'cognición', 'personalidad', 'terapia', 'psiquiatria', 'psiquiatría'],
    tags: ['psicología', 'salud', 'sociales']
  },
  derecho: {
    keywords: ['derecho', 'law', 'legal', 'ley', 'juridico', 'jurídico', 'justicia', 'tribunal', 'corte', 'abogado', 'legislacion', 'legislación', 'constitucion', 'constitución'],
    tags: ['derecho', 'legal', 'sociales']
  },
  medicina: {
    keywords: ['medicina', 'medicine', 'medico', 'médico', 'salud', 'enfermedad', 'diagnostico', 'diagnóstico', 'tratamiento', 'anatomia', 'anatomía', 'fisiologia', 'fisiología', 'cirugia', 'cirugía'],
    tags: ['medicina', 'salud', 'ciencia']
  },
  arte: {
    keywords: ['arte', 'art', 'pintura', 'escultura', 'dibujo', 'diseño', 'creativo', 'artistico', 'artístico', 'musica', 'música', 'teatro', 'danza'],
    tags: ['arte', 'cultura', 'creatividad']
  },
  ingenieria: {
    keywords: ['ingeniería', 'ingenieria', 'engineering', 'civil', 'mecanica', 'mecánica', 'electrica', 'eléctrica', 'electronica', 'electrónica', 'sistemas', 'industrial', 'arquitectura'],
    tags: ['ingeniería', 'tecnología', 'construcción']
  }
};

// Tipos de documentos
const TIPOS_DOCUMENTO = {
  ejercicios: {
    keywords: ['ejercicios', 'ejercicio', 'practica', 'práctica', 'taller', 'workshop', 'problemas', 'problema', 'solucion', 'solución'],
    tags: ['ejercicios', 'práctica', 'taller']
  },
  examen: {
    keywords: ['examen', 'exam', 'test', 'evaluacion', 'evaluación', 'parcial', 'final', 'quiz', 'prueba'],
    tags: ['examen', 'evaluación', 'prueba']
  },
  resumen: {
    keywords: ['resumen', 'summary', 'sintesis', 'síntesis', 'apuntes', 'notas', 'notes', 'resumenes', 'resúmenes'],
    tags: ['resumen', 'síntesis', 'apuntes']
  },
  teoria: {
    keywords: ['teoria', 'teoría', 'theory', 'conceptos', 'concepto', 'fundamentos', 'fundamento', 'principios', 'principio'],
    tags: ['teoría', 'conceptos', 'fundamentos']
  },
  guia: {
    keywords: ['guia', 'guía', 'guide', 'manual', 'tutorial', 'instrucciones', 'paso a paso'],
    tags: ['guía', 'manual', 'tutorial']
  },
  presentacion: {
    keywords: ['presentacion', 'presentación', 'presentation', 'diapositivas', 'slides', 'powerpoint', 'ppt'],
    tags: ['presentación', 'diapositivas']
  }
};

// Niveles académicos
const NIVELES_ACADEMICOS = {
  basico: {
    keywords: ['basico', 'básico', 'inicial', 'introduccion', 'introducción', 'principiante', 'beginner', 'nivel 1', 'nivel i'],
    tags: ['básico', 'inicial']
  },
  intermedio: {
    keywords: ['intermedio', 'intermediate', 'medio', 'nivel 2', 'nivel ii', 'avanzado basico'],
    tags: ['intermedio']
  },
  avanzado: {
    keywords: ['avanzado', 'advanced', 'superior', 'nivel 3', 'nivel iii', 'master', 'maestria', 'maestría', 'doctorado'],
    tags: ['avanzado', 'superior']
  }
};

/**
 * Normaliza texto para búsqueda (elimina acentos, convierte a minúsculas)
 */
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .trim();
}

/**
 * Busca palabras clave en el texto
 */
function buscarKeywords(texto, keywordList) {
  const textoNormalizado = normalizarTexto(texto);
  return keywordList.some(keyword => 
    textoNormalizado.includes(normalizarTexto(keyword))
  );
}

/**
 * Genera etiquetas basadas en el área de conocimiento
 */
function generarEtiquetasArea(texto) {
  const etiquetas = [];
  
  for (const [area, config] of Object.entries(AREAS_CONOCIMIENTO)) {
    if (buscarKeywords(texto, config.keywords)) {
      etiquetas.push(...config.tags);
    }
  }
  
  return etiquetas;
}

/**
 * Genera etiquetas basadas en el tipo de documento
 */
function generarEtiquetasTipo(texto) {
  const etiquetas = [];
  
  for (const [tipo, config] of Object.entries(TIPOS_DOCUMENTO)) {
    if (buscarKeywords(texto, config.keywords)) {
      etiquetas.push(...config.tags);
    }
  }
  
  return etiquetas;
}

/**
 * Genera etiquetas basadas en el nivel académico
 */
function generarEtiquetasNivel(texto) {
  const etiquetas = [];
  
  for (const [nivel, config] of Object.entries(NIVELES_ACADEMICOS)) {
    if (buscarKeywords(texto, config.keywords)) {
      etiquetas.push(...config.tags);
    }
  }
  
  return etiquetas;
}

/**
 * Genera etiquetas automáticas basadas en múltiples fuentes
 * @param {Object} options - Opciones para el etiquetado
 * @param {string} options.fileName - Nombre del archivo
 * @param {string} options.title - Título del documento
 * @param {string} options.description - Descripción del documento
 * @returns {Array<string>} Array de etiquetas generadas
 */
function generarEtiquetasAutomaticas({ 
  fileName = '', 
  title = '', 
  description = ''
}) {
  const etiquetas = new Set();
  
  // Combinar todos los textos para análisis
  const textoCompleto = `${fileName} ${title} ${description}`.trim();
  
  if (!textoCompleto) {
    return [];
  }
  
  // 1. Etiquetas por área de conocimiento
  const etiquetasArea = generarEtiquetasArea(textoCompleto);
  etiquetasArea.forEach(tag => etiquetas.add(tag));
  
  // 2. Etiquetas por tipo de documento
  const etiquetasTipo = generarEtiquetasTipo(textoCompleto);
  etiquetasTipo.forEach(tag => etiquetas.add(tag));
  
  // 3. Etiquetas por nivel académico
  const etiquetasNivel = generarEtiquetasNivel(textoCompleto);
  etiquetasNivel.forEach(tag => etiquetas.add(tag));
  
  // 4. Etiquetas adicionales basadas en patrones específicos
  const textoLower = normalizarTexto(textoCompleto);
  
  // Detectar idioma
  if (buscarKeywords(textoCompleto, ['english', 'ingles', 'inglés', 'en', 'eng'])) {
    etiquetas.add('inglés');
  }
  
  // Detectar si es material de estudio
  if (buscarKeywords(textoCompleto, ['estudio', 'study', 'aprender', 'learn', 'material'])) {
    etiquetas.add('material de estudio');
  }
  
  // Convertir Set a Array y ordenar
  return Array.from(etiquetas).sort();
}

export { generarEtiquetasAutomaticas };

