// Spanish uses the modern 27-letter alphabet; Ñ remains distinct from N.
export const vocabulary = {
  dog: "perro", cat: "gato", juice: "zumo", sausage: "salchicha", sun: "sol", house: "casa",
  banana: "plátano", balloon: "globo", milk: "leche", window: "ventana", clock: "reloj", chocolate: "chocolate",
  cow: "vaca", book: "libro", candy: "caramelo", cake: "tarta", car: "coche", duck: "pato",
  apple: "manzana", fish: "pez", tree: "árbol", flower: "flor", ball: "pelota", star: "estrella", shoe: "zapato",
  rabbit: "conejo", bear: "oso", lion: "león", elephant: "elefante", giraffe: "jirafa", monkey: "mono",
  horse: "caballo", sheep: "oveja", pig: "cerdo", mouse: "ratón", frog: "rana", turtle: "tortuga",
  butterfly: "mariposa", bee: "abeja", snail: "caracol", bird: "pájaro", rooster: "gallo", penguin: "pingüino",
  pear: "pera", orange: "naranja", lemon: "limón", strawberry: "fresa", grapes: "uvas", watermelon: "sandía",
  carrot: "zanahoria", tomato: "tomate", cucumber: "pepino", bread: "pan", cheese: "queso", egg: "huevo",
  icecream: "helado", pizza: "pizza", bus: "autobús", train: "tren", plane: "avión", boat: "barco",
  bicycle: "bicicleta", rocket: "cohete", umbrella: "paraguas", key: "llave", chair: "silla", bed: "cama",
  cup: "taza", spoon: "cuchara", brush: "cepillo de dientes", pencil: "lápiz", scissors: "tijeras", hat: "gorro",
  shirt: "camisa", sock: "calcetín", mitten: "manopla", drum: "tambor", guitar: "guitarra", kite: "cometa",
  moon: "luna", cloud: "nube", rainbow: "arcoíris", snowman: "muñeco de nieve", leaf: "hoja", mushroom: "seta", shell: "concha",
};
export const initial = (text) => [...text][0].toLocaleUpperCase("es-ES").replace(/[ÁÉÍÓÚÜ]/g, (letter) => ({ Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U" })[letter]);
export const alphabet = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
export const early = [..."ACELMPRST"];
export const rows = Array.from({ length: 9 }, (_, i) => alphabet.slice(i * 3, i * 3 + 3));
export const clueText = {
  woof: "¿Quién hace guau guau?", meow: "¿Quién hace miau?", moo: "¿Quién hace muu?", quack: "¿Quién hace cuac cuac?",
  baa: "¿Quién hace beee?", rooster: "¿Quién hace quiquiriquí?", oink: "¿Quién hace oinc oinc?", neigh: "¿Qué animal relincha?",
  trunk: "¿Quién tiene una trompa larga?", neck: "¿Quién tiene el cuello muy largo?", mane: "¿Quién tiene una gran melena alrededor de la cara?",
  ears: "¿Quién tiene las orejas largas?", shell: "¿Quién lleva un caparazón duro en la espalda?", snail: "¿Quién se arrastra despacio con una casita a cuestas?",
  butterfly: "¿Quién vuela con alas de colores?", honey: "¿Quién hace miel?", water: "¿Quién vive debajo del agua?",
  sweet: "¿Qué es dulce?", sour: "¿Qué tiene un sabor ácido?", red: "¿Qué es de color rojo en la imagen?", yellow: "¿Qué es de color amarillo en la imagen?", green: "¿Qué es de color verde en la imagen?",
  fruit: "¿Cuál es una fruta?", drink: "¿Qué podemos beber?", cold: "¿Qué está frío y se derrite?", carrot: "¿Qué verdura le gusta al conejo?",
  read: "¿Qué podemos leer?", time: "¿Qué nos dice la hora?", rain: "¿Qué nos protege de la lluvia?", unlock: "¿Con qué abrimos una cerradura?",
  sleep: "¿Dónde dormimos?", sit: "¿Dónde nos sentamos?", soup: "¿Con qué comemos la sopa?", teeth: "¿Con qué nos cepillamos los dientes?",
  draw: "¿Con qué dibujamos en el papel?", cut: "¿Con qué cortamos el papel?", head: "¿Qué nos ponemos en la cabeza?", hands: "¿Qué nos mantiene las manos calentitas?",
  feet: "¿Qué nos ponemos en los pies?", rails: "¿Qué va por las vías?", fly: "¿En qué viajamos por el cielo?", sail: "¿En qué viajamos por el agua?",
  pedals: "¿Qué tiene dos ruedas y pedales?", space: "¿Qué puede volar al espacio?", kick: "¿A qué le podemos dar una patada al jugar?",
  strings: "¿Qué instrumento musical tiene cuerdas?", beat: "¿Qué tocamos golpeándolo con palillos?", snow: "¿Qué hacemos con la nieve?",
  rainbow: "¿Qué aparece en el cielo después de la lluvia y tiene muchos colores?", sun: "¿Qué brilla de día y nos da calor?",
};
export const ui = {
  update: "Actualizar el juego", appName: "Palabras y números", auto: "Automático", seed: "Número de pregunta",
  gameNames: { initialSet: "Empieza por una letra", countGroup: "Cuenta los círculos", memoryPairs: "Encuentra las parejas", letterOrder: "Letras en orden", firstLetter: "La primera letra", describe: "Adivina con pistas", arithmetic: "Suma y resta", compare: "Compara los números", listenChoose: "Escucha y elige", missingNumber: "El número que falta", makeAmount: "Crea una cantidad", patternNext: "Continúa la serie" },
  patternNames: { circle: "círculo", square: "cuadrado", triangle: "triángulo", diamond: "rombo", coral: "rosa", teal: "turquesa", gold: "amarillo", purple: "morado" },
  play: "Jugar", next: "Siguiente", again: "Otra vez", try: "¡Inténtalo otra vez!", good: "¡Muy bien!", star: "¡Una estrella nueva!", party: "¡Fiesta de estrellas!",
  speaker: "Escuchar otra vez", parent: "Para adultos", back: "Volver", menu: "Menú", choose: "Elige un idioma", parentQuestion: "¿Cuánto es 12 + 7?", parentWrong: "Inténtalo otra vez", parentTitle: "Menú para adultos",
  install: "Instalar la aplicación", installHelp: "Abre el menú del navegador y elige Añadir a la pantalla de inicio o Instalar aplicación.", installDone: "La aplicación ya está instalada.",
  debug: "Probar los juegos", debugHint: "Las preguntas de prueba no dan estrellas.", voice: "Voz", voiceReady: "Voz grabada en español", voiceMissing: "Este dispositivo no tiene una voz en español. Añádela en los ajustes del dispositivo.", voiceTest: "Probar la voz",
  mute: "Sonido", volume: "Volumen", difficulty: "Dificultad", reset: "Borrar el progreso", resetAsk: "¿Quieres borrar todas las estrellas y el progreso?", level: ["Fácil", "Medio", "Más difícil"],
  initialSet: (letter) => `Toca todas las imágenes cuyo nombre empieza por la letra ${letter}.`, countGroup: (n) => `¿Dónde hay ${n} ${n === 1 ? "círculo" : "círculos"}?`,
  memoryPairs: "Encuentra las parejas de palabra e imagen.", letterOrder: "Toca las letras en orden alfabético.", firstLetter: (name) => `¿Cuál es la primera letra de la palabra ${name}?`, firstLetterPicture: "¿Por qué letra empieza el nombre de esta imagen?",
  arithmetic: "Resuelve la operación.", compare: "¿Qué signo corresponde?", arithmeticSpeech: (a, b, plus) => `${a} ${plus ? "más" : "menos"} ${b}. ¿Cuánto es?`, compareSpeech: (a, b) => `${a} y ${b}. ¿Qué signo corresponde?`,
  listenChoose: "Escucha y elige la imagen.", missingNumber: "¿Qué número falta?", makeAmount: (n) => `Pon ${n} ${n === 1 ? "estrella" : "estrellas"}. Toca el más o el menos.`, patternNext: "¿Qué viene después?",
  facts: { woof: clueText.woof, meow: clueText.meow, moo: clueText.moo, quack: clueText.quack, red: clueText.red, sweet: clueText.sweet },
  reactions: "Compañero de imágenes", reactionPreview: "Ver las expresiones", artPreview: "Todas las imágenes", reactionNames: { thinking: "Pensando", happy: "¡Bien!", sad: "Vamos a intentarlo otra vez", surprised: "¡Vaya!", oops: "¡Uy!", celebrating: "¡A celebrar!" },
  audioLoading: "Preparando la voz…", audioSpeaking: "Escucha…", audioError: "Toca Escuchar otra vez. Comprueba la conexión y el sonido.", audioMuted: "El sonido está apagado",
  progress: (n) => `${n} de 5 para conseguir una estrella`, offline: "Descargar el audio en español para jugar sin conexión", offlineBusy: "Descargando…", offlineReady: "Audio guardado para jugar sin conexión", offlineError: "La descarga no se ha completado. Comprueba la conexión y vuelve a intentarlo.",
  memoryHint: "Da la vuelta a dos tarjetas. Une la palabra con su imagen.", parentHint: "Resuelve la suma para abrir los ajustes.",
};
export const speech = {
  numbers: ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"],
  plus: "más", minus: "menos", and: "y", answer: "¿Cuánto es?", first: "¿Cuál es la primera letra de esta palabra?",
  letters: ["a", "be", "ce", "de", "e", "efe", "ge", "hache", "i", "jota", "ka", "ele", "eme", "ene", "eñe", "o", "pe", "cu", "erre", "ese", "te", "u", "uve", "uve doble", "equis", "ye", "zeta"],
};
