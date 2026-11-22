import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Film,
  Mic,
  Clock,
  Sparkles,
  Eye,
  LayoutList,
  FileText,
  Edit3,
  Check,
  AlertTriangle,
  Volume2,
  VolumeX,
  Move,
  Layers,
  Maximize2,
  Minimize2,
  CheckSquare,
  Square,
  Zap,
  ArrowRight,
  Music,
  PenTool,
  MessageSquare,
  Send,
  Trash2,
  Undo2,
  Eraser,
  Smile,
  UserCheck,
  Wand2,
  Headphones,
  Highlighter,
  Type,
  Minus,
  Bot,
  RefreshCw
} from 'lucide-react';

// ============================================================================
// DONNÉES DU STORYBOARD & PLAN HIÉRARCHISÉ (8 SLIDES / 5 ACTES / 6M30)
// ============================================================================
const INITIAL_SLIDES = [
  {
    id: 1,
    act: "I. L'ACCROCHE (THE HOOK)",
    actShort: "Accroche",
    title: "Le Cliché vs La Réalité",
    startTime: 0,
    endTime: 45,
    durationLabel: "0:45",
    timeRange: "0:00 – 0:45",
    palette: "editorial",
    paletteName: "Noir Éditorial & Contraste Brut",
    bgHex: "#050505",
    accentHex: "#f43f5e",
    intention: "Provocateur, calme, sourire en coin",
    visualConcept: "Typographie géante du cliché que tout le monde répète, barrée d'un trait vif pour poser la vraie question.",
    pptTips: "Fond noir #050505. Police Serif élégante pour la citation, et Sans-Serif incisive pour 'Really?'. Animation : apparition du trait rouge après 10 secondes de parole.",
    stageDirection: "Reste immobile au centre. Laisse 2 secondes de silence après avoir posé la question 'Is it really that great to be young?' en balayant la salle du regard.",
    anchors: [
      "\"Enjoy, best years of your life!\"",
      "Two sides of the same coin",
      "Is it really that great?"
    ],
    bridgePhrase: "\"Because before it gets great... let's be honest about how heavy it can feel.\"",
    defaultScript: "Every time you talk to an adult, they tell you the exact same thing: \"Enjoy your youth, these are the best years of your life!\" Wait... are they really? Is it actually that great to be young? Today, I want to look at this question from two completely different angles. First, how brutally hard it can be. And second, how incredible it could—and should—be.",
    mascotJokes: [
      "Hey! Stay focused on him! I see him work so hard... I know your attention span is so short, but make an effort please!",
      "(Looks at you) Nice pause right there. Very dramatic. TEDx approved.",
      "\"Best years of your life\" — sponsored by adults who forgot algebra exams."
    ],
    hierarchyDetails: {
      mainPoint: "Briser immédiatement le mythe idéalisé de la jeunesse",
      subPoints: [
        "Citer la phrase que tous les adultes répètent aux jeunes",
        "Introduire la dualité : le fardeau invisible vs la promesse dorée",
        "Annoncer le voyage en deux temps de la présentation"
      ]
    }
  },
  {
    id: 2,
    act: "II. ACTE I — L'OMBRE (LE POIDS D'ÊTRE JEUNE)",
    actShort: "Acte I.A (Micro)",
    title: "L'Échelle Micro : Le Décalage & La Solitude",
    startTime: 45,
    endTime: 120,
    durationLabel: "1:15",
    timeRange: "0:45 – 2:00",
    palette: "shadow",
    paletteName: "Bleu Nuit Désaturé (Isolement)",
    bgHex: "#0b1120",
    accentHex: "#38bdf8",
    intention: "Intime, authentique, vulnérable sans être plaintif",
    visualConcept: "Un nuage de points flous connectés en haut à gauche (le groupe au collège) et un minuscule point net, isolé tout en bas à droite.",
    pptTips: "Utilise la transition 'Morphose' sur PowerPoint/Canva. Très peu de texte : seulement 5 mots en bas à droite. Le vide au centre de la slide crée visuellement le sentiment de solitude.",
    stageDirection: "Baisse légèrement le volume de ta voix pour créer de la proximité. Fais un pas vers le public en racontant ton souvenir du collège.",
    anchors: [
      "Middle school: being the 'too young' kid",
      "Out of sync, no friends, no armor yet",
      "When your small world feels huge"
    ],
    bridgePhrase: "\"And right when you finally figure out how to fit in with others... you look up and see the world waiting for you.\"",
    defaultScript: "Let's start with the personal part. In middle school, I was that kid who was just... too young. Out of sync with everyone else, standing in the courtyard with zero friends. When you're that young, you don't have emotional armor yet. Being alone at twelve feels like the entire universe has rejected you, because that tiny schoolyard IS your entire universe.",
    mascotJokes: [
      "(Glances at you) Hey, no friends in middle school? Look at you now, holding the mic in front of everyone!",
      "I'll be your friend! Even if I'm just 400 lines of code on a slide.",
      "Hey row 3! Put that phone down, he's sharing a real memory here!"
    ],
    hierarchyDetails: {
      mainPoint: "L'épreuve personnelle : grandir en décalage sans carapace émotionnelle",
      subPoints: [
        "Anecdote personnelle : être le gars trop jeune au collège, sans amis",
        "L'absence de recul quand on est très jeune : le collège est alors 'tout notre univers'",
        "La difficulté de se construire quand on n'a pas encore les codes sociaux"
      ]
    }
  },
  {
    id: 3,
    act: "II. ACTE I — L'OMBRE (LE POIDS D'ÊTRE JEUNE)",
    actShort: "Acte I.B (Macro 1)",
    title: "L'Échelle Macro : Une Jeunesse 'Too Early'",
    startTime: 120,
    endTime: 165,
    durationLabel: "0:45",
    timeRange: "2:00 – 2:45",
    palette: "shadow",
    paletteName: "Gris Acier & Alerte Froide",
    bgHex: "#0f172a",
    accentHex: "#ef4444",
    intention: "Lucide, rythmé, constat générationnel",
    visualConcept: "Une barre de chargement de l'insouciance bloquée à 38% avec un message système : 'Interrupted — Forced to grow up too fast'.",
    pptTips: "Garde le même fond sombre que la slide 2 pour la continuité de l'Acte I. Style minimaliste façon interface système qui plante.",
    stageDirection: "Redresse-toi, prends un ton plus affirmé et journalistique. Tu ne parles plus seulement de toi, tu parles au nom de toute ta génération.",
    anchors: [
      "A world getting harder & faster",
      "A generation forced to be 'too early'",
      "Hyper-awareness killing innocence"
    ],
    bridgePhrase: "\"We didn't just lose our carefree years early—we were handed a massive bill.\"",
    defaultScript: "And then you grow up a little. You finally find your people, you lift your head... and you see the world. A world that is harder and faster than ever. Ours is a 'too early' generation. We were forced to mature way too fast, scrolling through global crises before breakfast.",
    mascotJokes: [
      "Hey! Stay focused on him! I see him work so hard... I know your attention span is 8 seconds because of TikTok, but make an effort please!",
      "Childhood.exe has stopped working. Please reboot the planet.",
      "(Side-eye toward you) Tell 'em! Preach!"
    ],
    hierarchyDetails: {
      mainPoint: "L'accélération du monde qui vole l'insouciance trop tôt",
      subPoints: [
        "Passage du 'je' (collège) au 'nous' (une génération entière)",
        "Une jeunesse 'too early' : exposée instantanément à toutes les crises mondiales",
        "L'obligation de devenir mature et stratégique avant même d'avoir 20 ans"
      ]
    }
  },
  {
    id: 4,
    act: "II. ACTE I — L'OMBRE (LE POIDS D'ÊTRE JEUNE)",
    actShort: "Acte I.B (Macro 2)",
    title: "L'Addition Générationnelle (The Invoice)",
    startTime: 165,
    endTime: 195,
    durationLabel: "0:30",
    timeRange: "2:45 – 3:15",
    palette: "shadow",
    paletteName: "Ardoise Sombre & Contraste Glacial",
    bgHex: "#090d16",
    accentHex: "#94a3b8",
    intention: "Grave, percutant, ironie froide",
    visualConcept: "Un ticket de caisse minimaliste intitulé 'THE GENERATIONAL INVOICE' listant les crises créées par les prédécesseurs, avec en bas : 'TOTAL DUE: FIX EVERYTHING'.",
    pptTips: "Un simple rectangle vertical au centre imitant un reçu avec une police Monospace. Très visuel et immédiatement compréhensible en 3 secondes.",
    stageDirection: "Pointe légèrement l'écran du bras sans te retourner complètement. Accélère légèrement le débit sur l'énumération des problèmes, puis coupe net.",
    anchors: [
      "Paying for a meal we didn't order",
      "Expected to solve predecessors' messes",
      "Building a future on shaky ground"
    ],
    bridgePhrase: "[PAUSE 3 SECONDES] \"Looking at all this... you might wonder: why would anyone want to be young?\"",
    defaultScript: "It feels like sitting down at a restaurant just as the previous generation leaves the table—and the waiter hands US the bill. Climate, economy, broken systems... We are expected to solve every single mess our predecessors caused, while somehow figuring out our own lives.",
    mascotJokes: [
      "Wait, I didn't even order the sparkling water and I have to pay for the climate?!",
      "(Looks at you) Don't look at me, my wallet is empty too!",
      "Can we split the generational bill, or is tip included?"
    ],
    hierarchyDetails: {
      mainPoint: "Le paradoxe injuste : devoir réparer un monde qu'on n'a pas cassé",
      subPoints: [
        "La métaphore de l'addition laissée sur la table par les générations précédentes",
        "Double pression : réussir sa propre vie + sauver la planète et le système",
        "Point culminant de la tension dramatique de la présentation"
      ]
    }
  },
  {
    id: 5,
    act: "III. LE PIVOT (THE PLOT TWIST)",
    actShort: "Le Pivot",
    title: "L'Écran Noir & L'Étincelle",
    startTime: 195,
    endTime: 225,
    durationLabel: "0:30",
    timeRange: "3:15 – 3:45",
    palette: "pivot",
    paletteName: "Blackout & Première Lueur Ambrée",
    bgHex: "#050505",
    accentHex: "#f59e0b",
    intention: "Suspendu, magnétique, bascule émotionnelle",
    visualConcept: "Écran presque entièrement noir. Au centre, une simple étincelle dorée / un curseur qui clignote devant une page vierge.",
    pptTips: "Passe d'une slide chargée mentalement à un écran quasi vide avec un seul halo doré (#f59e0b). Ça force le public à décrocher de l'écran pour te regarder toi.",
    stageDirection: "MOUVEMENT CLÉ : Fais deux pas sur le côté pour changer d'espace sur scène. Laisse un vrai silence de 3 secondes avant de prononcer 'And yet...'. Adoucis ta voix.",
    anchors: [
      "And yet... every older person envies us",
      "Being young IS the big deal",
      "The ultimate superpower: blank pages"
    ],
    bridgePhrase: "\"Because being young isn't just about the weight you carry. It's about what you're allowed to do with it.\"",
    defaultScript: "And yet... pause for a second. If being young is so heavy, why would every billionaire on earth trade all their money just to be our age again? Because being young IS the big deal. We hold the one thing money can never buy back: unwritten pages.",
    mascotJokes: [
      "Shhh... plot twist incoming! Watch him take two steps to the side...",
      "(Whispers to audience) Don't blink, this is where the lighting gets warm and cinematic!",
      "(Nods proudly at you) Nailed the transition!"
    ],
    hierarchyDetails: {
      mainPoint: "Renverser la perspective : pourquoi la jeunesse reste malgré tout le plus grand trésor",
      subPoints: [
        "Si c'est si dur, pourquoi tous les adultes paieraient cher pour revenir à notre place ?",
        "Parce que rien n'est encore figé dans le marbre",
        "Transition visuelle et physique de l'ombre froide vers la chaleur dorée"
      ]
    }
  },
  {
    id: 6,
    act: "IV. ACTE II — LA LUMIÈRE (HOW GREAT IT SHOULD BE)",
    actShort: "Acte II.A (Fun/Learn)",
    title: "Le Droit à l'Erreur & Le Fun",
    startTime: 225,
    endTime: 285,
    durationLabel: "1:00",
    timeRange: "3:45 – 4:45",
    palette: "golden",
    paletteName: "Golden Hour (Ambre & Terracotta)",
    bgHex: "#1c1208",
    accentHex: "#fbbf24",
    intention: "Énergique, solaire, libérateur",
    visualConcept: "Le mot 'FAILURE' barré d'un trait lumineux doré et remplacé par 'PLOT DEVELOPMENT — Having fun & learning'.",
    pptTips: "Changement radical de température couleur : dégradé chaud (brun ambre profond vers or lumineux). Le public ressent physiquement le soulagement visuel.",
    stageDirection: "Souris, ouvre tes gestes (bras ouverts). Ton rythme redevient fluide et enthousiaste.",
    anchors: [
      "Having fun without guilt",
      "Trying, failing, and calling it 'learning'",
      "Nothing is permanent yet"
    ],
    bridgePhrase: "\"And while you're having fun and learning, you get to answer the most important questions of your life.\"",
    defaultScript: "Being young is about having fun without needing an excuse. It's about trying crazy things, messing up, and calling it 'learning' instead of 'failing'. Nothing is locked in stone yet. Every mistake you make at twenty is just plot development for your life.",
    mascotJokes: [
      "Wait, mistakes are just plot development? Then my life is a 12-season Netflix drama!",
      "(Looks at you with sunglasses vibe) Loving this Golden Hour energy on you!",
      "Hey audience! Smile a little, the depressing part of the talk is officially over!"
    ],
    hierarchyDetails: {
      mainPoint: "Réhabiliter l'insouciance, le jeu et l'apprentissage par l'essai",
      subPoints: [
        "L'âge où se tromper de voie ne s'appelle pas 'échouer', mais 'apprendre'",
        "L'importance vitale de s'amuser ('having fun') malgré le sérieux du monde",
        "La liberté d'expérimenter avant que les responsabilités ne figent tout"
      ]
    }
  },
  {
    id: 7,
    act: "IV. ACTE II — LA LUMIÈRE (HOW GREAT IT SHOULD BE)",
    actShort: "Acte II.B (Love/Live)",
    title: "La Boussole : What to Love & How to Live",
    startTime: 285,
    endTime: 330,
    durationLabel: "0:45",
    timeRange: "4:45 – 5:30",
    palette: "golden",
    paletteName: "Or Solaire & Chaleur Humaine",
    bgHex: "#231407",
    accentHex: "#f97316",
    intention: "Inspirant, sincère, profond",
    visualConcept: "Trois piliers lumineux minimalistes : '1. WHAT TO LOVE' | '2. HOW TO LOVE' | '3. LIVE WITH ZERO REGRETS'.",
    pptTips: "Affiche les 3 cartes/colonnes une par une au clic pendant que tu prononces ta phrase : 'figuring out what to love, how, and living it in a way that won't make you regret it.'",
    stageDirection: "Compte sur tes doigts ou marque 3 points dans l'espace devant toi (gauche, centre, droite) pour ancrer visuellement les 3 piliers dans l'esprit du public.",
    anchors: [
      "Figuring out WHAT to love (passions, people)",
      "Learning HOW to love & care deeply",
      "Living in a way you won't regret"
    ],
    bridgePhrase: "\"So yes, being young is really the big deal. But like every great deal... there's a catch.\"",
    defaultScript: "Most importantly, youth is the time for figuring out what to love—which passions, which dreams, which people. It's about learning HOW to love them deeply, and living every day in a way that won't make you look back with regret.",
    mascotJokes: [
      "(Looks warmly at you) From the lonely kid in Slide 2 to teaching us how to love in Slide 7. Character arc 10/10!",
      "Step 1: Figure out what to love. Step 2: Tacos. Definitely tacos.",
      "Hey! Pay attention to these 3 pillars, they might be on the life exam!"
    ],
    hierarchyDetails: {
      mainPoint: "Le cœur de ta philosophie : définir ce qu'on aime et comment on veut vivre",
      subPoints: [
        "Trouver ce qui nous fait vibrer (passions, amis, vocation) loin du solitaire du collège",
        "Apprendre *comment* aimer (avec authenticité et intensité)",
        "Construire dès maintenant une vie alignée qui ne laissera pas d'amertume"
      ]
    }
  },
  {
    id: 8,
    act: "V. CONCLUSION (THE TAKEAWAY)",
    actShort: "Finale & Liste",
    title: "Le Paradoxe du Temps & La Liste",
    startTime: 330,
    endTime: 390,
    durationLabel: "1:00",
    timeRange: "5:30 – 6:30",
    palette: "golden",
    paletteName: "Aube Dorée (Clarté Finale)",
    bgHex: "#181006",
    accentHex: "#facc15",
    intention: "Chaleureux, mémorable, appel à l'action direct",
    visualConcept: "À gauche : le paradoxe du sablier ('Long enough to enjoy / Short enough to regret'). À droite : la carte 'MY YOUTH LIST' avec la dernière case '[ ] Just be happy'.",
    pptTips: "C'est la slide qui reste affichée à la fin pendant les applaudissements. Garde-la épurée, lumineuse et ultra-positive.",
    stageDirection: "Reviens au centre exact de la scène. Ralentis sur les deux dernières phrases. Regarde le public droit dans les yeux sur '...and just be happy.' Puis silence et merci.",
    anchors: [
      "Long enough to enjoy, short enough to regret",
      "Take a break, write a list, get through it",
      "...and just be happy."
    ],
    bridgePhrase: "\"Thank you.\"",
    defaultScript: "Because as with every great deal, it doesn't last forever. So yes, it is really that great to be young: it's something long enough to let you enjoy it, but short enough to leave you with plenty of regrets if you waste it. So if you're still in those great ages: take a break, write a list, manage to get through it... and just be happy. Thank you.",
    mascotJokes: [
      "Hey! Stay focused on him for the last 60 seconds! I see him work so hard, I know your attention span is short, but make an effort please!",
      "(Wipes a digital tear looking at you) \"Long enough to enjoy, short enough to regret\" — drop the mic already!",
      "Checklist item #5: Clap loudly for him right now!"
    ],
    hierarchyDetails: {
      mainPoint: "L'urgence douce de la jeunesse et le passage à l'action immédiat",
      subPoints: [
        "La formule choc : chaque 'bonne affaire' (great deal) a une date d'expiration",
        "Le paradoxe temporel : assez long pour savourer, assez court pour regretter",
        "L'appel à l'action concret : faire une pause, écrire sa liste, la vivre, et être heureux"
      ]
    }
  }
];

const TOTAL_DURATION = 390; // 6 minutes 30 secondes

// ============================================================================
// UTILITAIRE GEMINI API AVEC RETRY EXPONENTIEL
// ============================================================================
async function callGeminiAPI({ userPrompt, systemPrompt, base64Image = null }) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const parts = [{ text: userPrompt }];
  if (base64Image) {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64
      }
    });
  }

  const payload = {
    contents: [{ role: "user", parts }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    }
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      throw new Error("Réponse vide");
    } catch (err) {
      if (attempt === delays.length) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
}

export default function App() {
  // ==========================================================================
  // ÉTATS PRINCIPAUX DE L'APPLICATION
  // ==========================================================================
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // 4 modes : 'studio' | 'atelier' | 'hierarchy' | 'cheatsheet'
  const [activeTab, setActiveTab] = useState('studio');

  // États du simulateur visuel 16:9
  const [letterbox, setLetterbox] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);
  const [slide1Revealed, setSlide1Revealed] = useState(true);
  const [checklistState, setChecklistState] = useState([true, true, true, false]);

  // États du Chronomètre de répétition (6m30)
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  // État d'édition des mots-clés
  const [editingAnchors, setEditingAnchors] = useState(false);
  const [tempAnchors, setTempAnchors] = useState([]);

  // ==========================================================================
  // ÉTATS : SYNTHÉTISEUR MUSICAL DE FOCUS (WEB AUDIO API)
  // ==========================================================================
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMode, setMusicMode] = useState('lofi'); // 'lofi' | 'cinema' | 'rain'
  const [musicVolume, setMusicVolume] = useState(0.35);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const musicIntervalRef = useRef(null);
  const activeNodesRef = useRef([]);

  // ==========================================================================
  // ÉTATS : LE PETIT COMPLICE ANIMÉ SUR LA SLIDE (STAGE BUDDY)
  // ==========================================================================
  const [mascotEnabled, setMascotEnabled] = useState(true);
  const [mascotX, setMascotX] = useState(76); // Position horizontale (%) sur la slide
  const [mascotWalking, setMascotWalking] = useState(false);
  const [mascotFacingDirection, setMascotFacingDirection] = useState(-1); // -1 gauche, 1 droite
  const [mascotGaze, setMascotGaze] = useState('speaker'); // 'speaker' | 'audience' | 'sideeye'
  const [speakerSide, setSpeakerSide] = useState('left'); // 'left' | 'right' (Où tu te tiens à côté de l'écran)
  const [mascotBubbleVisible, setMascotBubbleVisible] = useState(true);
  const [mascotBubbleText, setMascotBubbleText] = useState(INITIAL_SLIDES[0].mascotJokes[0]);
  const [mascotJokeIndex, setMascotJokeIndex] = useState(0);
  const [mascotGeneratingJoke, setMascotGeneratingJoke] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState('focus'); // 'focus' | 'wink' | 'shock' | 'proud'

  // ==========================================================================
  // ÉTATS : ATELIER (SCRIPTS PAR SLIDE, CROQUIS CANVAS & COACH IA)
  // ==========================================================================
  const [scriptsBySlide, setScriptsBySlide] = useState(() =>
    INITIAL_SLIDES.reduce((acc, s) => ({ ...acc, [s.id]: s.defaultScript }), {})
  );
  const [sketchesBySlide, setSketchesBySlide] = useState({}); // { [slideId]: dataUrl }
  const [sketchHistoryBySlide, setSketchHistoryBySlide] = useState({}); // { [slideId]: [dataUrl, ...] }
  const [overlaySketchOnSlide, setOverlaySketchOnSlide] = useState(true);
  const [showSlideBgInPad, setShowSlideBgInPad] = useState(true);

  // Outils de dessin Canvas
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const [drawTool, setDrawTool] = useState('pen'); // 'pen' | 'highlighter' | 'arrow' | 'rect' | 'eraser' | 'text'
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawSize, setDrawSize] = useState(4);
  const [customTextLabel, setCustomTextLabel] = useState('Stay focused!');

  // Lecture vocale TTS
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);

  // Discussion Coach IA
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: "Salut ! Je suis ton Coach TEDx. Écris ton texte en anglais ou dessine ton idée de slide ici : je te donnerai un avis 100 % franc (ce qui claque, mais aussi ce qui est lourd, trop long ou maladroit à l'oral) pour que tes 5-8 minutes soient mémorables."
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentSlide = slides[currentSlideIndex];
  const currentScript = scriptsBySlide[currentSlide.id] || '';

  // ==========================================================================
  // MOTEUR AUDIO WEB API (LO-FI BEATS / CINEMA DRONE / RAIN & BINAURAL)
  // ==========================================================================
  const stopAllMusicNodes = useCallback(() => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Ignorer si déjà arrêté
      }
    });
    activeNodesRef.current = [];
  }, []);

  const startProceduralMusic = useCallback(
    (mode) => {
      stopAllMusicNodes();

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.connect(ctx.destination);
      }
      masterGainRef.current.gain.setValueAtTime(musicVolume, ctx.currentTime);

      // Générateur de bruit doux (vinyle ou pluie)
      const createNoiseNode = (filterFreq = 900, gainLevel = 0.04) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = gainLevel;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGainRef.current);
        noise.start();
        activeNodesRef.current.push(noise, filter, noiseGain);
      };

      if (mode === 'lofi') {
        // Texture vinyle légère
        createNoiseNode(1100, 0.025);

        // Progression d'accords Jazz/Lo-Fi chaleureux (Fm9 -> Bb13 -> Ebmaj9 -> C7alt)
        const chords = [
          [174.61, 207.65, 261.63, 311.13, 392.0], // Fm9
          [116.54, 207.65, 246.94, 293.66, 349.23], // Bb13
          [155.56, 196.0, 233.08, 293.66, 349.23], // Ebmaj9
          [130.81, 164.81, 233.08, 277.18, 329.63]  // C7#9
        ];

        let step = 0;
        const playLoFiStep = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
          const now = ctx.currentTime;
          const beatInBar = step % 8;
          const chordIndex = Math.floor(step / 8) % chords.length;

          // Accord Rhodes au début de la mesure
          if (beatInBar === 0) {
            const notes = chords[chordIndex];
            notes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = idx === 0 ? 'triangle' : 'sine';
              // Léger désaccordage lo-fi (wow/flutter)
              osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.003), now);

              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(idx === 0 ? 0.11 : 0.055, now + 0.08);
              gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.1);

              osc.connect(gain);
              gain.connect(masterGainRef.current);
              osc.start(now);
              osc.stop(now + 3.15);
            });
          }

          // Kick feutré sur les temps 0 et 5
          if (beatInBar === 0 || beatInBar === 5) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(115, now);
            kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.14);

            kickGain.gain.setValueAtTime(0.28, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            kickOsc.connect(kickGain);
            kickGain.connect(masterGainRef.current);
            kickOsc.start(now);
            kickOsc.stop(now + 0.24);
          }

          // Snare/Rim doux sur les temps 2 et 6
          if (beatInBar === 2 || beatInBar === 6) {
            const snareOsc = ctx.createOscillator();
            const snareGain = ctx.createGain();
            snareOsc.type = 'triangle';
            snareOsc.frequency.setValueAtTime(240, now);
            snareOsc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

            snareGain.gain.setValueAtTime(0.09, now);
            snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            snareOsc.connect(snareGain);
            snareGain.connect(masterGainRef.current);
            snareOsc.start(now);
            snareOsc.stop(now + 0.13);
          }

          step++;
        };

        playLoFiStep();
        musicIntervalRef.current = setInterval(playLoFiStep, 400); // 75 BPM
      } else if (mode === 'cinema') {
        // Nappe cinématique chaude (Golden Hour Drone)
        const baseFreqs = [110, 164.81, 220, 277.18, 329.63]; // A major warm pad
        baseFreqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = f * (1 + (i - 2) * 0.0015);
          gain.gain.value = i === 0 ? 0.12 : 0.05;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 650;

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGainRef.current);
          osc.start();
          activeNodesRef.current.push(osc, filter, gain);
        });
        createNoiseNode(450, 0.015);
      } else if (mode === 'rain') {
        // Pluie douce + fréquences binaurales de concentration (216Hz / 220Hz)
        createNoiseNode(800, 0.12);
        [216, 220, 324].forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          gain.gain.value = 0.045;
          osc.connect(gain);
          gain.connect(masterGainRef.current);
          osc.start();
          activeNodesRef.current.push(osc, gain);
        });
      }
    },
    [musicVolume, stopAllMusicNodes]
  );

  // Mise à jour du volume en direct
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        musicVolume,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [musicVolume]);

  // Changement de piste ou Play/Pause
  const toggleMusic = () => {
    if (musicPlaying) {
      stopAllMusicNodes();
      setMusicPlaying(false);
    } else {
      startProceduralMusic(musicMode);
      setMusicPlaying(true);
    }
  };

  const changeMusicMode = (newMode) => {
    setMusicMode(newMode);
    if (musicPlaying) {
      startProceduralMusic(newMode);
    }
  };

  useEffect(() => {
    return () => {
      stopAllMusicNodes();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopAllMusicNodes]);

  // ==========================================================================
  // ANIMATION DU PETIT COMPLICE SUR SLIDE (MARCHE, STOP & REGARD VERS TOI)
  // ==========================================================================
  // Met à jour la blague par défaut quand on change de slide
  useEffect(() => {
    const jokes = slides[currentSlideIndex]?.mascotJokes || [];
    if (jokes.length > 0) {
      setMascotBubbleText(jokes[0]);
      setMascotJokeIndex(0);
    }
  }, [currentSlideIndex, slides]);

  // Regard périodique autonome entre le public et l'orateur (toi)
  useEffect(() => {
    if (!mascotEnabled || mascotWalking) return;
    const gazeTimer = setInterval(() => {
      setMascotGaze((prev) => {
        const nextOptions = ['speaker', 'audience', 'speaker', 'sideeye'];
        const next = nextOptions[Math.floor(Math.random() * nextOptions.length)];
        return next;
      });
    }, 3800);
    return () => clearInterval(gazeTimer);
  }, [mascotEnabled, mascotWalking]);

  // Déclenche l'animation : il marche sur la slide, s'arrête net, regarde le public et lance son message
  const triggerAttentionWalk = (customMessage = null) => {
    setMascotEnabled(true);
    setMascotBubbleVisible(false);
    setMascotWalking(true);
    setMascotEmotion('focus');

    // Départ d'un côté vers le centre
    const startX = mascotX > 50 ? 14 : 84;
    const targetX = 50;
    const dir = targetX > startX ? 1 : -1;
    setMascotFacingDirection(dir);
    setMascotX(startX);

    let currentPos = startX;
    const stepTimer = setInterval(() => {
      currentPos += dir * 2.4;
      if ((dir === 1 && currentPos >= targetX) || (dir === -1 && currentPos <= targetX)) {
        clearInterval(stepTimer);
        setMascotX(targetX);
        setMascotWalking(false);
        setMascotGaze('audience');
        setMascotEmotion('shock');
        setMascotBubbleText(
          customMessage ||
            "Hey! Stay focused on him! I see him work so hard... I know your attention span is so short, but make an effort please!"
        );
        setMascotBubbleVisible(true);

        // Après 3.5 secondes, il tourne la tête vers toi avec un clin d'œil complice
        setTimeout(() => {
          setMascotGaze('speaker');
          setMascotEmotion('wink');
        }, 3500);
      } else {
        setMascotX(currentPos);
      }
    }, 35);
  };

  // Passer à la blague suivante sur la slide actuelle
  const cycleMascotJoke = () => {
    const jokes = currentSlide.mascotJokes || [];
    if (!jokes.length) return;
    const nextIdx = (mascotJokeIndex + 1) % jokes.length;
    setMascotJokeIndex(nextIdx);
    setMascotBubbleText(jokes[nextIdx]);
    setMascotBubbleVisible(true);
    setMascotGaze(nextIdx % 2 === 0 ? 'audience' : 'speaker');
    setMascotEmotion(nextIdx % 2 === 0 ? 'focus' : 'wink');
  };

  // Générer une blague ou réaction sur mesure avec Gemini à partir du texte écrit par l'utilisateur
  const generateMascotJokeFromScript = async () => {
    setMascotGeneratingJoke(true);
    setMascotEnabled(true);
    setMascotBubbleVisible(true);
    setMascotBubbleText("Listening to your script... thinking of a joke...");
    try {
      const prompt = `Slide #${currentSlide.id}: "${currentSlide.title}"
Speaker's current draft script for this slide:
"""
${currentScript}
"""
Write ONE short, witty, self-aware stage-mascot line in English (max 22 words) that either:
1) Kindly roasts the audience's short attention span and tells them to focus on the speaker because he worked hard, OR
2) Makes a funny side-comment while glancing at the speaker about what he just said in his script.
Return ONLY the line itself, no quotes.`;

      const system =
        "You are a witty, supportive little animated character living on the speaker's presentation slides. You adore the speaker, frequently glance at him on stage, and tease the audience about their short attention span.";

      const joke = await callGeminiAPI({ userPrompt: prompt, systemPrompt: system });
      const cleanJoke = joke.trim().replace(/^["']|["']$/g, '');
      setMascotBubbleText(cleanJoke);
      setMascotGaze('speaker');
      setMascotEmotion('wink');
    } catch (e) {
      setMascotBubbleText(
        "Hey! Stay focused on him! Even the Wi-Fi is trying to keep up with how hard he worked on this slide!"
      );
    } finally {
      setMascotGeneratingJoke(false);
    }
  };

  // ==========================================================================
  // GESTION DU CHRONOMÈTRE DE RÉPÉTITION (6M30)
  // ==========================================================================
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsRunning(false);
            return TOTAL_DURATION;
          }
          const nextSec = prev + 1;
          if (autoAdvance) {
            const matchingIdx = slides.findIndex(
              (s) => nextSec >= s.startTime && nextSec < s.endTime
            );
            if (matchingIdx !== -1 && matchingIdx !== currentSlideIndex) {
              setCurrentSlideIndex(matchingIdx);
            }
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, autoAdvance, slides, currentSlideIndex]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSelectSlide = (index, syncTimer = false) => {
    setCurrentSlideIndex(index);
    setEditingAnchors(false);
    if (syncTimer) {
      setElapsedSeconds(slides[index].startTime);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setEditingAnchors(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setEditingAnchors(false);
    }
  };

  // ==========================================================================
  // GESTION DU TABLEAU DE CROQUIS TACTILE (HTML5 CANVAS PAR SLIDE)
  // ==========================================================================
  // Charge le croquis de la slide active quand on change de slide ou d'onglet
  useEffect(() => {
    if (activeTab !== 'atelier') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const savedDataUrl = sketchesBySlide[currentSlide.id];
    if (savedDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = savedDataUrl;
    }
  }, [currentSlide.id, activeTab]);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const saveCanvasToState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSketchesBySlide((prev) => ({ ...prev, [currentSlide.id]: dataUrl }));
    setSketchHistoryBySlide((prev) => {
      const list = prev[currentSlide.id] || [];
      return { ...prev, [currentSlide.id]: [...list.slice(-9), dataUrl] };
    });
  };

  const handleDrawStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getCanvasPoint(e);

    if (drawTool === 'text') {
      ctx.save();
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = drawColor;
      ctx.fillText(customTextLabel || 'Idea', pt.x, pt.y);
      ctx.restore();
      saveCanvasToState();
      return;
    }

    isDrawingRef.current = true;
    startPosRef.current = pt;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };

  const handleDrawMove = (e) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pt = getCanvasPoint(e);

    if (drawTool === 'pen' || drawTool === 'highlighter' || drawTool === 'eraser') {
      ctx.save();
      if (drawTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = drawSize * 5;
      } else if (drawTool === 'highlighter') {
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize * 4;
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.restore();
    } else if (drawTool === 'rect' || drawTool === 'arrow') {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.save();
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawSize;
      ctx.lineCap = 'round';

      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;

      if (drawTool === 'rect') {
        ctx.strokeRect(sx, sy, pt.x - sx, pt.y - sy);
      } else if (drawTool === 'arrow') {
        const headlen = 16;
        const angle = Math.atan2(pt.y - sy, pt.x - sx);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(
          pt.x - headlen * Math.cos(angle - Math.PI / 6),
          pt.y - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(
          pt.x - headlen * Math.cos(angle + Math.PI / 6),
          pt.y - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveCanvasToState();
  };

  const handleUndoSketch = () => {
    const history = sketchHistoryBySlide[currentSlide.id] || [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (history.length <= 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSketchesBySlide((prev) => ({ ...prev, [currentSlide.id]: null }));
      setSketchHistoryBySlide((prev) => ({ ...prev, [currentSlide.id]: [] }));
      return;
    }

    const nextHistory = history.slice(0, -1);
    const prevDataUrl = nextHistory[nextHistory.length - 1];
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = prevDataUrl;
    setSketchesBySlide((prev) => ({ ...prev, [currentSlide.id]: prevDataUrl }));
    setSketchHistoryBySlide((prev) => ({ ...prev, [currentSlide.id]: nextHistory }));
  };

  const handleClearSketch = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSketchesBySlide((prev) => ({ ...prev, [currentSlide.id]: null }));
    setSketchHistoryBySlide((prev) => ({ ...prev, [currentSlide.id]: [] }));
  };

  // ==========================================================================
  // LECTURE À HAUTE VOIX (TTS) & MÉTRIQUES DE RYTHME DU SCRIPT
  // ==========================================================================
  const wordCount = currentScript.trim() ? currentScript.trim().split(/\s+/).length : 0;
  // Rythme TED Talk posé : ~130 mots par minute
  const estimatedSpeakSeconds = Math.round((wordCount / 130) * 60);
  const targetSlideSeconds = currentSlide.endTime - currentSlide.startTime;

  const toggleSpeakScript = () => {
    if (!window.speechSynthesis) return;
    if (isSpeakingTTS) {
      window.speechSynthesis.cancel();
      setIsSpeakingTTS(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentScript);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingTTS(false);
    utterance.onerror = () => setIsSpeakingTTS(false);
    setIsSpeakingTTS(true);
    window.speechSynthesis.speak(utterance);
  };

  // ==========================================================================
  // COACH IA PERTINENT & FRANC (ANALYSE TEXTE + DESSIN DE SLIDE)
  // ==========================================================================
  const askPertinentCoach = async (customQuestion = null, includeSketch = false) => {
    const questionText =
      customQuestion ||
      userChatInput.trim() ||
      "Donne-moi ton avis franc (points forts et points faibles) sur mon texte pour cette slide.";

    if (!customQuestion) {
      setUserChatInput('');
    }

    const userMsg = {
      role: 'user',
      text: questionText,
      slideRef: `Slide ${currentSlide.id} (${currentSlide.actShort})`
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const sketchBase64 = includeSketch ? sketchesBySlide[currentSlide.id] : null;
      const systemInstruction = `Tu es un directeur de prise de parole TEDx exigeant, bienveillant mais 100 % FRANC (pas de flatterie vide).
L'utilisateur prépare une présentation en anglais de 5 à 8 minutes intitulée "Is it that great to be young?".
Arc global :
- Acte I : Pourquoi c'est dur d'être jeune (le gamin trop jeune sans amis au collège -> un monde toujours plus dur pour une jeunesse "too early" qui doit réparer les erreurs de ses prédécesseurs).
- Acte II & Conclusion : Pourquoi c'est génial ("the big deal") mais court : s'amuser, apprendre, trouver quoi aimer et comment l'aimer sans regrets, faire une pause, écrire sa liste et juste être heureux.

Quand tu analyses son texte anglais ou son croquis de slide :
1. Réponds en français, de manière structurée et directe :
   - **Ce qui fonctionne vraiment (Points forts)** : rythme, émotion, punchlines.
   - **Ce qui coince ou sonne bizarre à l'oral (Points faibles)** : tournures pas naturelles en anglais parlé, phrases trop longues à respirer, ou dépassement du timing prévu pour la slide (${targetSlideSeconds}s).
   - **Proposition d'amélioration concrète (en anglais)** : propose une version parlée plus percutante et fluide ("spoken English") tout en gardant sa voix authentique.
2. Si une image de son croquis de slide est jointe, critique aussi la lisibilité visuelle de son idée de slide et comment son petit personnage animé peut interagir avec.`;

      const fullPrompt = `Slide actuelle : Slide #${currentSlide.id} - "${currentSlide.title}" (${currentSlide.act})
Durée cible de cette slide : ${targetSlideSeconds} secondes.
Durée estimée de son texte actuel : ${estimatedSpeakSeconds} secondes (${wordCount} mots).

Texte anglais actuel de l'utilisateur pour cette slide :
"""
${currentScript}
"""

Demande de l'utilisateur : ${questionText}`;

      const reply = await callGeminiAPI({
        userPrompt: fullPrompt,
        systemPrompt: systemInstruction,
        base64Image: sketchBase64
      });

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          slideRef: `Slide ${currentSlide.id}`
        }
      ]);
    } catch (error) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Impossible de joindre le Coach IA pour l'instant. Vérifie ta connexion et réessaie dans quelques secondes !"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Édition des notes d'ancrage
  const startEditingAnchors = () => {
    setTempAnchors([...currentSlide.anchors]);
    setEditingAnchors(true);
  };

  const saveAnchors = () => {
    const updated = slides.map((s, idx) =>
      idx === currentSlideIndex ? { ...s, anchors: tempAnchors } : s
    );
    setSlides(updated);
    setEditingAnchors(false);
  };

  // Calcul du statut de rythme (Pacing HUD)
  const getPacingStatus = () => {
    if (elapsedSeconds === 0 && !isRunning) {
      return {
        label: "Prêt à répéter",
        color: "text-zinc-400 bg-zinc-800/80 border-zinc-700",
        detail: `Cible : ${currentSlide.timeRange}`
      };
    }
    if (elapsedSeconds < currentSlide.startTime) {
      const diff = currentSlide.startTime - elapsedSeconds;
      return {
        label: `En avance (${diff}s)`,
        color: "text-sky-300 bg-sky-950/70 border-sky-700/60",
        detail: "Prends ton temps, pose tes silences."
      };
    }
    if (elapsedSeconds >= currentSlide.startTime && elapsedSeconds <= currentSlide.endTime) {
      const remaining = currentSlide.endTime - elapsedSeconds;
      if (remaining <= 10) {
        return {
          label: `Transition dans ${remaining}s`,
          color: "text-amber-300 bg-amber-950/80 border-amber-600/70",
          detail: "Prépare ta phrase charnière."
        };
      }
      return {
        label: `Timing Parfait (${remaining}s)`,
        color: "text-emerald-300 bg-emerald-950/70 border-emerald-600/60",
        detail: "Tu es pile dans le tempo."
      };
    }
    const over = elapsedSeconds - currentSlide.endTime;
    return {
      label: `Dépassement +${over}s`,
      color: "text-rose-300 bg-rose-950/80 border-rose-600/70",
      detail: "Passe à la slide suivante !"
    };
  };

  const pacing = getPacingStatus();

  const getPaletteBadgeClasses = (palette) => {
    switch (palette) {
      case 'editorial':
        return 'bg-zinc-900 text-zinc-100 border-zinc-600';
      case 'shadow':
        return 'bg-slate-900 text-sky-300 border-sky-800/80';
      case 'pivot':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/80';
      case 'golden':
        return 'bg-gradient-to-r from-amber-950 to-orange-950 text-amber-200 border-amber-500/60';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  // ==========================================================================
  // COMPOSANT VISUEL DU PETIT COMPLICE ANIMÉ SUR LA SLIDE ("STAGE BUDDY")
  // ==========================================================================
  const renderStageMascot = () => {
    if (!mascotEnabled) return null;

    // Calcul du décalage des pupilles pour te regarder sur le côté de la scène
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;
    let headTilt = 0;

    if (mascotGaze === 'speaker') {
      eyeOffsetX = speakerSide === 'left' ? -4.5 : 4.5;
      eyeOffsetY = -1;
      headTilt = speakerSide === 'left' ? -8 : 8;
    } else if (mascotGaze === 'sideeye') {
      eyeOffsetX = speakerSide === 'left' ? -5.5 : 5.5;
      eyeOffsetY = -2;
      headTilt = speakerSide === 'left' ? -5 : 5;
    } else {
      // Regarde droit vers le public
      eyeOffsetX = 0;
      eyeOffsetY = 0;
      headTilt = 0;
    }

    const isGolden = currentSlide.palette === 'golden' || currentSlide.palette === 'pivot';

    return (
      <div
        style={{ left: `${mascotX}%` }}
        className="absolute bottom-[9%] -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto select-none transition-all duration-75"
      >
        {/* Bulle de dialogue animée */}
        {mascotBubbleVisible && (
          <div
            onClick={cycleMascotJoke}
            title="Clique pour changer de réplique"
            className={`mb-2 w-48 sm:w-64 p-2.5 sm:p-3 rounded-2xl shadow-2xl border cursor-pointer transition-all transform hover:scale-[1.02] ${
              isGolden
                ? 'bg-stone-950/95 border-amber-400/80 text-amber-50 shadow-amber-500/20'
                : 'bg-zinc-950/95 border-sky-400/80 text-slate-100 shadow-sky-500/20'
            }`}
          >
            <div className="flex items-center justify-between gap-1 text-[9px] font-mono uppercase tracking-wider mb-1 opacity-75">
              <span className={isGolden ? 'text-amber-400 font-bold' : 'text-sky-400 font-bold'}>
                {mascotGaze === 'speaker'
                  ? `👀 Regard vers toi (${speakerSide === 'left' ? 'Gauche' : 'Droite'})`
                  : '📢 Interpelle le public'}
              </span>
              <span className="text-zinc-400">Tap = Blague suiv.</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium leading-snug">
              {mascotBubbleText}
            </p>
          </div>
        )}

        {/* Personnage SVG expressif qui marche, s'arrête et te regarde */}
        <button
          onClick={() => {
            if (!mascotBubbleVisible) {
              setMascotBubbleVisible(true);
            } else {
              setMascotGaze((g) => (g === 'speaker' ? 'audience' : 'speaker'));
            }
          }}
          className={`group relative flex flex-col items-center focus:outline-none ${
            mascotWalking ? 'animate-bounce' : ''
          }`}
          title="Clique sur le complice pour qu'il te regarde ou regarde le public"
        >
          <svg
            width="58"
            height="64"
            viewBox="0 0 64 70"
            className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.75)] transition-transform duration-300"
            style={{
              transform: `rotate(${headTilt}deg) scaleX(${mascotWalking ? mascotFacingDirection : 1})`
            }}
          >
            {/* Halo sous les pieds */}
            <ellipse
              cx="32"
              cy="64"
              rx="16"
              ry="4"
              fill={isGolden ? 'rgba(251,191,36,0.35)' : 'rgba(56,189,248,0.35)'}
            />

            {/* Antenne lumineuse */}
            <line
              x1="32"
              y1="6"
              x2="32"
              y2="15"
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="32"
              cy="5"
              r="4"
              fill={isGolden ? '#f59e0b' : '#38bdf8'}
              className="animate-ping"
              style={{ animationDuration: '2.5s' }}
            />
            <circle cx="32" cy="5" r="4" fill={isGolden ? '#fde68a' : '#bae6fd'} />

            {/* Corps / Tête arrondie */}
            <rect
              x="12"
              y="14"
              width="40"
              height="36"
              rx="14"
              fill={isGolden ? '#291507' : '#0f172a'}
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="2.5"
            />

            {/* Visage / Écran interne */}
            <rect
              x="16"
              y="19"
              width="32"
              height="22"
              rx="8"
              fill="#09090b"
            />

            {/* Sourcils expressifs */}
            <path
              d={
                mascotEmotion === 'shock'
                  ? 'M 20 23 Q 24 20 28 23 M 36 23 Q 40 20 44 23'
                  : mascotGaze === 'speaker'
                  ? 'M 20 22 Q 24 20 28 23 M 36 24 Q 40 21 44 22'
                  : 'M 20 24 L 28 24 M 36 24 L 44 24'
              }
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Yeux + Pupilles qui suivent l'orateur ou le public */}
            <g transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`}>
              {/* Oeil gauche */}
              <circle cx="24" cy="30" r="3.5" fill={isGolden ? '#fde68a' : '#e0f2fe'} />
              <circle cx="24" cy="30" r="1.6" fill="#09090b" />
              {/* Oeil droit (clin d'œil si wink) */}
              {mascotEmotion === 'wink' ? (
                <path
                  d="M 36 30 Q 40 27 44 30"
                  stroke={isGolden ? '#fde68a' : '#e0f2fe'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <>
                  <circle cx="40" cy="30" r="3.5" fill={isGolden ? '#fde68a' : '#e0f2fe'} />
                  <circle cx="40" cy="30" r="1.6" fill="#09090b" />
                </>
              )}
            </g>

            {/* Bouche */}
            {mascotEmotion === 'shock' || mascotWalking ? (
              <rect
                x="28"
                y="35"
                width="8"
                height="4"
                rx="2"
                fill={isGolden ? '#fbbf24' : '#38bdf8'}
              />
            ) : (
              <path
                d="M 27 36 Q 32 40 37 36"
                stroke={isGolden ? '#fbbf24' : '#38bdf8'}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Bras (fait coucou quand il interpelle) */}
            <path
              d={mascotGaze === 'audience' ? 'M 12 32 L 4 22' : 'M 12 32 L 6 38'}
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={mascotGaze === 'speaker' ? 'M 52 32 L 60 24' : 'M 52 32 L 58 38'}
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Jambes animées pendant la marche */}
            <line
              x1="25"
              y1="50"
              x2={mascotWalking ? '21' : '25'}
              y2="61"
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="39"
              y1="50"
              x2={mascotWalking ? '43' : '39'}
              y2="61"
              stroke={isGolden ? '#fbbf24' : '#38bdf8'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  };

  // ==========================================================================
  // RENDU VISUEL DE CHAQUE SLIDE 16:9 (DESIGN CINÉMATIQUE)
  // ==========================================================================
  const renderSlideCanvas = (slide) => {
    switch (slide.id) {
      case 1:
        return (
          <div
            onClick={() => setSlide1Revealed(!slide1Revealed)}
            className="w-full h-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 sm:p-14 relative select-none cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.35em] text-zinc-500 mb-4 sm:mb-6 font-mono">
              What everyone tells you at 18
            </span>

            <div className="relative inline-block text-center max-w-2xl">
              <h1
                className={`text-lg sm:text-4xl md:text-5xl font-serif italic tracking-tight transition-all duration-500 ${
                  slide1Revealed ? 'text-zinc-500 scale-95' : 'text-white scale-100'
                }`}
              >
                “Enjoy it, these are the best years of your life.”
              </h1>
              <div
                className={`absolute left-0 top-1/2 h-1 sm:h-1.5 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)] transition-all duration-700 -rotate-2 ${
                  slide1Revealed ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </div>

            <div
              className={`mt-5 sm:mt-10 flex flex-col items-center transition-all duration-700 ${
                slide1Revealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <span className="text-base sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white text-center">
                Is it <span className="text-rose-500 underline decoration-rose-500/40 underline-offset-8">really</span> that great to be young?
              </span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#070b14] via-[#0f172a] to-[#060911] text-slate-100 p-6 sm:p-12 relative overflow-hidden flex flex-col justify-between select-none">
            <div className="relative w-3/5 h-3/5">
              <div className="absolute -top-6 -left-6 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl" />
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-2">
                The Noise / Everyone Else
              </div>
              <div className="relative w-36 sm:w-64 h-20 sm:h-36">
                {[
                  { t: '10%', l: '8%', s: 'w-5 h-5 sm:w-6 sm:h-6' },
                  { t: '22%', l: '20%', s: 'w-6 h-6 sm:w-8 sm:h-8' },
                  { t: '14%', l: '36%', s: 'w-5 h-5 sm:w-7 sm:h-7' },
                  { t: '38%', l: '14%', s: 'w-7 h-7 sm:w-9 sm:h-9' },
                  { t: '30%', l: '32%', s: 'w-5 h-5 sm:w-6 sm:h-6' },
                  { t: '18%', l: '52%', s: 'w-6 h-6 sm:w-8 sm:h-8' },
                  { t: '44%', l: '46%', s: 'w-5 h-5 sm:w-7 sm:h-7' }
                ].map((dot, i) => (
                  <div
                    key={i}
                    style={{ top: dot.t, left: dot.l }}
                    className={`absolute ${dot.s} rounded-full bg-slate-400/25 blur-[2px] border border-slate-300/20`}
                  />
                ))}
              </div>
            </div>

            <div className="self-end flex flex-col items-end text-right z-10">
              <div className="relative flex items-center justify-center mb-2 sm:mb-4 mr-2">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-30" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-300 shadow-[0_0_15px_#38bdf8]" />
              </div>
              <p className="text-sm sm:text-2xl font-light tracking-wide text-slate-200">
                Too young. <span className="text-sky-400 font-medium">Out of sync.</span>
              </p>
              <p className="text-[10px] sm:text-sm text-slate-500 font-mono mt-1">
                No armor yet. When a small school feels like the whole universe.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full h-full bg-[#0b101d] text-slate-100 p-5 sm:p-12 flex flex-col items-center justify-center relative select-none overflow-hidden">
            <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-400 mb-2 sm:mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  CAREFREE_YOUTH.EXE
                </span>
                <span className="text-rose-400 font-semibold">HALTED AT 38%</span>
              </div>

              <div className="w-full h-5 sm:h-6 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 p-1 flex items-center">
                <div className="h-full w-[38%] bg-gradient-to-r from-sky-500 to-rose-500 rounded-sm relative" />
                <div className="h-full flex-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(239,68,68,0.08)_6px,rgba(239,68,68,0.08)_12px)]" />
              </div>

              <div className="mt-4 sm:mt-6 flex items-start gap-2.5 sm:gap-3 bg-rose-950/30 border border-rose-500/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] sm:text-sm font-mono uppercase tracking-wider text-rose-300 font-bold">
                    Error: A Generation Forced to Grow Up "Too Early"
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                    Hyper-connected. Hyper-aware. Carrying adult anxieties before even turning twenty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full h-full bg-[#070a12] text-slate-200 p-4 sm:p-10 flex items-center justify-center relative select-none overflow-hidden">
            <div className="w-full max-w-xs sm:max-w-sm bg-slate-100 text-slate-900 rounded-sm p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] font-mono border-t-4 border-slate-900 relative">
              <div className="text-center border-b border-dashed border-slate-400 pb-2 sm:pb-3">
                <div className="text-[11px] sm:text-sm font-black tracking-widest uppercase">
                  THE GENERATIONAL INVOICE
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                  TABLE: EARTH • ORDERED BY: PREDECESSORS
                </div>
              </div>

              <div className="py-2 sm:py-3 space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>01. CLIMATE CRISIS</span>
                  <span className="font-bold">URGENT</span>
                </div>
                <div className="flex justify-between">
                  <span>02. ECONOMIC INSTABILITY</span>
                  <span className="font-bold">COMPOUNDED</span>
                </div>
                <div className="flex justify-between">
                  <span>03. GLOBAL POLARIZATION</span>
                  <span className="font-bold">CRITICAL</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-3 flex justify-between items-baseline">
                <span className="text-[10px] sm:text-xs font-bold">TOTAL DUE BY YOUTH:</span>
                <span className="text-xs sm:text-base font-black text-rose-600 tracking-tight">
                  FIX EVERYTHING
                </span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="w-full h-full bg-[#030303] text-amber-50 p-6 sm:p-14 flex flex-col items-center justify-center relative select-none overflow-hidden">
            <div className="w-64 h-64 rounded-full bg-amber-500/15 blur-3xl absolute pointer-events-none animate-pulse" />
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              <div className="w-2.5 h-6 sm:w-3 sm:h-8 bg-amber-400 rounded-sm shadow-[0_0_25px_#f59e0b] animate-pulse mb-4 sm:mb-6" />
              <h2 className="text-base sm:text-3xl md:text-4xl font-serif italic text-amber-100/95 tracking-wide leading-snug">
                “And yet... why would anyone trade everything to come back here?”
              </h2>
              <p className="mt-3 sm:mt-5 text-[10px] sm:text-sm font-mono uppercase tracking-[0.22em] text-amber-400/90">
                Because being young is still the biggest deal in the world.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#1f1206] via-[#2b1708] to-[#3b1d0a] text-amber-50 p-6 sm:p-14 flex flex-col items-center justify-center relative select-none overflow-hidden">
            <div className="relative z-10 text-center space-y-3 sm:space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> The Freedom of Unwritten Pages
              </div>
              <div className="relative inline-block">
                <span className="text-lg sm:text-4xl font-bold text-stone-500/80 tracking-tight">
                  MAKING MISTAKES
                </span>
                <div className="absolute left-0 top-1/2 w-full h-1 bg-amber-400 -rotate-2 shadow-[0_0_12px_#fbbf24]" />
              </div>
              <div className="text-xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                HAVING FUN & LEARNING.
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="w-full h-full bg-gradient-to-tr from-[#1c1008] via-[#291507] to-[#422006] text-amber-50 p-4 sm:p-10 flex flex-col justify-center relative select-none overflow-hidden">
            <div className="text-center mb-3 sm:mb-6">
              <span className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-400/80">
                The Real Purpose of Youth
              </span>
              <h3 className="text-sm sm:text-2xl font-serif italic text-amber-100 mt-0.5">
                Figuring out your own compass
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-5 max-w-3xl mx-auto w-full z-10">
              {[
                { num: "01", title: "WHAT TO LOVE", desc: "Passions, ideas & people." },
                { num: "02", title: "HOW TO LOVE", desc: "Connect deeply & truly." },
                { num: "03", title: "HOW TO LIVE", desc: "Zero room for regret." }
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-amber-950/40 backdrop-blur-md border border-amber-500/30 rounded-xl p-2.5 sm:p-5 flex flex-col justify-between shadow-lg"
                >
                  <span className="text-[10px] sm:text-xs font-mono text-amber-400 font-bold">{card.num}</span>
                  <div className="my-1 sm:my-2 text-xs sm:text-lg font-extrabold tracking-tight text-amber-100">
                    {card.title}
                  </div>
                  <p className="text-[9px] sm:text-xs text-amber-200/75 leading-snug">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#1c1105] via-[#2e1a07] to-[#451a03] text-amber-50 p-4 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 relative select-none overflow-hidden">
            <div className="flex-1 space-y-1.5 sm:space-y-3 z-10 text-center sm:text-left">
              <div className="inline-block px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
                Every Great Deal Has an Expiration Date
              </div>
              <h2 className="text-base sm:text-3xl font-extrabold leading-tight text-white">
                Long enough to <span className="text-amber-400">enjoy it.</span>
                <br />
                Short enough to <span className="text-orange-400 italic font-serif">regret it.</span>
              </h2>
            </div>

            <div className="w-full sm:w-64 bg-stone-950/85 border border-amber-500/40 rounded-xl p-3 sm:p-4 shadow-2xl z-10">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-1.5 mb-2 flex items-center justify-between">
                <span>THE YOUTH CHECKLIST</span>
              </div>
              <div className="space-y-1.5">
                {[
                  "1. Take a break",
                  "2. Write your list",
                  "3. Manage to get through it",
                  "4. Just be happy."
                ].map((item, idx) => {
                  const checked = checklistState[idx];
                  const isLast = idx === 3;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const next = [...checklistState];
                        next[idx] = !next[idx];
                        setChecklistState(next);
                      }}
                      className={`w-full flex items-center gap-2 text-left p-1.5 rounded-lg transition-all ${
                        isLast
                          ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold'
                          : 'hover:bg-stone-900 text-stone-200'
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                      )}
                      <span className={`text-[11px] sm:text-xs ${checked && !isLast ? 'line-through text-stone-400' : ''}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* ====================================================================
          BARRE SUPÉRIEURE STICKY MOBILE-FIRST (CHRONO + FOCUS MUSIC + MODES)
      ==================================================================== */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Logo & Titre */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-base font-bold tracking-tight text-white truncate max-w-[170px] sm:max-w-none">
                  Is it that great to be young?
                </h1>
                <span className="hidden lg:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                  Cible : 6m 30s
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 hidden sm:block">
                Studio Mobile & Desktop • Écriture, Croquis, Focus Music & Complice Animé
              </p>
            </div>
          </div>

          {/* Contrôles rapides toujours accessibles (Chrono + Focus Music) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mini Chrono Global */}
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-xs sm:text-sm font-bold text-white">
                {formatTime(elapsedSeconds)}
              </span>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`ml-1 p-1 rounded text-zinc-950 ${
                  isRunning ? 'bg-rose-500 text-white' : 'bg-emerald-400'
                }`}
                title={isRunning ? 'Pause Chrono' : 'Lancer Chrono'}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setElapsedSeconds(0);
                }}
                className="p-1 rounded text-zinc-400 hover:text-white"
                title="Reset Chrono"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Lecteur Focus Music Web Audio */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
              <button
                onClick={toggleMusic}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold transition-all ${
                  musicPlaying
                    ? 'bg-amber-500 text-zinc-950 shadow shadow-amber-500/30'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {musicPlaying ? 'Focus ON' : 'Focus Music'}
                </span>
                {/* Égaliseur animé quand la musique tourne */}
                {musicPlaying && (
                  <span className="flex items-end gap-0.5 h-3 ml-0.5">
                    <span className="w-0.5 h-3 bg-zinc-950 animate-pulse" />
                    <span className="w-0.5 h-2 bg-zinc-950 animate-bounce" />
                    <span className="w-0.5 h-3 bg-zinc-950 animate-pulse" />
                  </span>
                )}
              </button>

              <select
                value={musicMode}
                onChange={(e) => changeMusicMode(e.target.value)}
                className="bg-zinc-950 text-[11px] text-zinc-200 border border-zinc-800 rounded px-1.5 py-1 focus:outline-none"
                title="Choisir l'ambiance musicale de concentration"
              >
                <option value="lofi">🎵 Lo-Fi Beats</option>
                <option value="cinema">✨ Golden Drone</option>
                <option value="rain">🌧️ Rain & Focus</option>
              </select>

              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-12 sm:w-16 accent-amber-500 hidden md:block cursor-pointer"
                title="Volume Musique Focus"
              />
            </div>
          </div>

          {/* Sélecteur de Vues Desktop (Masqué sur mobile car remplacé par la barre du bas) */}
          <div className="hidden md:flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {[
              { id: 'studio', label: 'Slides & Scène', icon: Eye },
              { id: 'atelier', label: 'Atelier (Écrire & Dessiner)', icon: PenTool },
              { id: 'hierarchy', label: 'Plan Complet', icon: LayoutList },
              { id: 'cheatsheet', label: 'Antisèche', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-zinc-950 font-semibold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sélecteur rapide des 8 slides (Scrubbing bar tactile) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2 pt-0.5">
          <div className="w-full h-8 bg-zinc-900 rounded-lg p-1 border border-zinc-800 flex gap-1 relative overflow-x-auto no-scrollbar">
            {slides.map((s, idx) => {
              const widthPercent = ((s.endTime - s.startTime) / TOTAL_DURATION) * 100;
              const isSelected = idx === currentSlideIndex;

              let barStyle = 'bg-zinc-800 text-zinc-300';
              if (s.palette === 'shadow') barStyle = 'bg-slate-900 text-sky-300 border border-sky-900/50';
              if (s.palette === 'pivot') barStyle = 'bg-stone-950 text-amber-400 border border-amber-500/60';
              if (s.palette === 'golden') barStyle = 'bg-amber-950/70 text-amber-200 border border-amber-600/40';

              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx, false)}
                  style={{ width: `${Math.max(widthPercent, 10)}%` }}
                  className={`h-full min-w-[44px] rounded flex items-center justify-center sm:justify-between px-1.5 transition-all relative overflow-hidden ${barStyle} ${
                    isSelected ? 'ring-2 ring-amber-400 z-10 font-bold' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] truncate">
                    S{s.id} <span className="hidden sm:inline">• {s.actShort}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ====================================================================
          CONTENU PRINCIPAL SELON L'ONGLET ACTIF
      ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4">
        {/* ==================================================================
            ONGLET 1 : STUDIO & SCÈNE (SLIDE 16:9 + PETIT COMPLICE ANIMÉ)
        ================================================================== */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* COLONNE GAUCHE/CENTRE (7 cols) : ÉCRAN 16:9 + CONTRÔLES DU COMPLICE */}
            <div className={`${isFullscreenStage ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-4`}>
              {/* Barre d'outils au-dessus de la slide */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500 text-zinc-950">
                    SLIDE {currentSlide.id}/{slides.length}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getPaletteBadgeClasses(currentSlide.palette)}`}>
                    {currentSlide.paletteName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {sketchesBySlide[currentSlide.id] && (
                    <button
                      onClick={() => setOverlaySketchOnSlide(!overlaySketchOnSlide)}
                      className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                        overlaySketchOnSlide
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Croquis: {overlaySketchOnSlide ? 'ON' : 'OFF'}
                    </button>
                  )}
                  <button
                    onClick={() => setLetterbox(!letterbox)}
                    className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                      letterbox
                        ? 'bg-zinc-800 text-amber-300 border-amber-500/40'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Cinéma
                  </button>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                      showGrid
                        ? 'bg-zinc-800 text-amber-300 border-amber-500/40'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Grille
                  </button>
                  <button
                    onClick={() => setIsFullscreenStage(!isFullscreenStage)}
                    className="p-1.5 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hidden sm:inline-flex"
                  >
                    {isFullscreenStage ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* CADRE 16:9 DE LA SLIDE AVEC CROQUIS OVERLAY + COMPLICE ANIMÉ */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-black">
                {letterbox && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-[7%] bg-black z-20 border-b border-white/5 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-[7%] bg-black z-20 border-t border-white/5 pointer-events-none" />
                  </>
                )}

                {showGrid && (
                  <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-cyan-400/25" />
                    <div className="border-r border-b border-cyan-400/25" />
                    <div className="border-b border-cyan-400/25" />
                    <div className="border-r border-b border-cyan-400/25" />
                    <div className="border-r border-b border-cyan-400/25" />
                    <div className="border-b border-cyan-400/25" />
                    <div className="border-r border-cyan-400/25" />
                    <div className="border-r border-cyan-400/25" />
                    <div />
                  </div>
                )}

                {/* Contenu visuel de la slide active */}
                <div className="w-full h-full transition-all duration-500">
                  {renderSlideCanvas(currentSlide)}
                </div>

                {/* Superposition du croquis dessiné dans l'Atelier */}
                {overlaySketchOnSlide && sketchesBySlide[currentSlide.id] && (
                  <img
                    src={sketchesBySlide[currentSlide.id]}
                    alt="Croquis perso"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
                  />
                )}

                {/* LE PETIT COMPLICE ANIMÉ SUR LA SLIDE */}
                {renderStageMascot()}
              </div>

              {/* BARRE DE CONTRÔLE DU PETIT COMPLICE ANIMÉ (STAGE BUDDY) */}
              <div className="bg-zinc-900/95 border border-amber-500/30 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Ton Petit Complice sur Slide (Animation & Regards vers toi)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMascotEnabled(!mascotEnabled)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        mascotEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {mascotEnabled ? 'Affiché sur slide' : 'Masqué'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Bouton 1 : Marche + Stop + "Hey stay focused on him!" */}
                  <button
                    onClick={() => triggerAttentionWalk()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Animation "Hey! Stay focused on him!"
                  </button>

                  {/* Bouton 2 : Regard complice vers toi */}
                  <button
                    onClick={() => {
                      setMascotEnabled(true);
                      setMascotGaze((g) => (g === 'speaker' ? 'audience' : 'speaker'));
                      setMascotEmotion('wink');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    {mascotGaze === 'speaker' ? 'Regarde le public' : 'Me regarder (Clin d’œil)'}
                  </button>

                  {/* Choix de ton côté sur scène pour qu'il tourne la tête du bon côté */}
                  <button
                    onClick={() => setSpeakerSide((s) => (s === 'left' ? 'right' : 'left'))}
                    className="px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:border-zinc-700"
                    title="De quel côté de l'écran te tiens-tu en vrai ?"
                  >
                    Ma position : {speakerSide === 'left' ? '⬅️ Gauche écran' : 'Droite écran ➡️'}
                  </button>

                  {/* Bouton 3 : Blague suivante ou Générer une vanne IA sur ton texte */}
                  <button
                    onClick={cycleMascotJoke}
                    className="px-2.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200"
                  >
                    Autre blague ({mascotJokeIndex + 1}/{currentSlide.mascotJokes.length})
                  </button>

                  <button
                    onClick={generateMascotJokeFromScript}
                    disabled={mascotGeneratingJoke}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    {mascotGeneratingJoke ? 'Réflexion...' : 'Vanne IA sur mon texte'}
                  </button>
                </div>
              </div>

              {/* Navigation Précédent / Suivant + Raccourci vers l'Atelier */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" /> Slide Préc.
                </button>

                <button
                  onClick={() => setActiveTab('atelier')}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 text-xs font-semibold"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Écrire / Dessiner cette Slide
                </button>

                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 disabled:opacity-40 text-xs font-bold"
                >
                  Slide Suiv. <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* COLONNE DROITE (5 cols) : REPÈRES ORAUX & DIRECTION DE SCÈNE */}
            {!isFullscreenStage && (
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                    {currentSlide.act}
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {currentSlide.id}. {currentSlide.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ton : <strong className="text-white">{currentSlide.intention}</strong></span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Cible : <strong className="text-white">{currentSlide.durationLabel}</strong> ({currentSlide.timeRange})</span>
                    </div>
                  </div>
                </div>

                {/* Tes 3 Mots-Clés d'Ancrage */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-200">
                        Tes 3 Repères Oraux (English Anchors)
                      </h3>
                    </div>
                    {!editingAnchors ? (
                      <button
                        onClick={startEditingAnchors}
                        className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Modifier
                      </button>
                    ) : (
                      <button
                        onClick={saveAnchors}
                        className="flex items-center gap-1 text-xs bg-emerald-500 text-zinc-950 px-2.5 py-1 rounded font-bold"
                      >
                        <Check className="w-3.5 h-3.5" /> OK
                      </button>
                    )}
                  </div>

                  {!editingAnchors ? (
                    <ul className="space-y-2">
                      {currentSlide.anchors.map((anchor, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-zinc-950/90 border border-zinc-800/90 p-2.5 rounded-lg"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-zinc-100">{anchor}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2">
                      {tempAnchors.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const next = [...tempAnchors];
                            next[idx] = e.target.value;
                            setTempAnchors(next);
                          }}
                          className="w-full bg-zinc-950 border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      ))}
                    </div>
                  )}

                  {/* Aperçu rapide de ton texte écrit pour cette slide */}
                  <div className="mt-4 pt-3 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                      <span>Ton brouillon oral ({wordCount} mots • ~{estimatedSpeakSeconds}s)</span>
                      <button
                        onClick={toggleSpeakScript}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {isSpeakingTTS ? 'Stop' : 'Écouter'}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 leading-relaxed">
                      {currentScript}
                    </p>
                  </div>
                </div>

                {/* Posture & Recette PowerPoint */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-emerald-400 mb-1">
                      <Move className="w-4 h-4" />
                      Posture & Jeu de Scène
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                      {currentSlide.stageDirection}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-sky-400 mb-1">
                      <Layers className="w-4 h-4" />
                      Recette Visuelle (PowerPoint / Canva)
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                      {currentSlide.pptTips}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            ONGLET 2 : ATELIER (ÉCRIRE MON TEXTE + DESSINER LA SLIDE + COACH IA)
        ================================================================== */}
        {activeTab === 'atelier' && (
          <div className="space-y-6">
            {/* Barre de sélection de la slide en cours de création */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">
                    Atelier Créatif • Slide {currentSlide.id} sur {slides.length} ({currentSlide.timeRange})
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    {currentSlide.title}
                  </h2>
                </div>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setActiveTab('studio')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                Voir le résultat sur la Scène 16:9
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* COLONNE GAUCHE (7 cols) : ÉDITEUR DE TEXTE ORAL + TABLEAU DE DESSIN TACTILE */}
              <div className="lg:col-span-7 space-y-6">
                {/* BLOC 1 : ÉCRIRE ET TESTER SON TEXTE ANGLAIS */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        1. Ton Texte en Anglais (Slide {currentSlide.id})
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleSpeakScript}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSpeakingTTS
                            ? 'bg-rose-500 text-white'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {isSpeakingTTS ? 'Stop Voix' : 'Écouter comment ça sonne'}
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={currentScript}
                    onChange={(e) =>
                      setScriptsBySlide((prev) => ({
                        ...prev,
                        [currentSlide.id]: e.target.value
                      }))
                    }
                    placeholder="Write what you want to say on this slide in English..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl p-3.5 text-sm text-zinc-100 leading-relaxed focus:outline-none resize-y"
                  />

                  {/* Jauge de calibrage du temps parlé */}
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>
                        <strong>{wordCount} mots</strong> • Temps parlé estimé :{' '}
                        <strong
                          className={
                            estimatedSpeakSeconds > targetSlideSeconds + 12
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }
                        >
                          ~{estimatedSpeakSeconds} sec
                        </strong>{' '}
                        (Cible slide : {targetSlideSeconds} sec)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {estimatedSpeakSeconds > targetSlideSeconds + 12
                        ? '⚠️ Un peu long pour cette slide'
                        : estimatedSpeakSeconds < targetSlideSeconds - 20
                        ? '💡 Tu as encore de la marge'
                        : '✅ Calibrage idéal'}
                    </span>
                  </div>
                </div>

                {/* BLOC 2 : TABLEAU DE CROQUIS TACTILE POUR DESSINER LA SLIDE */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm font-bold text-white">
                        2. Dessine ton idée de Slide (Tactile & Souris)
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSlideBgInPad(!showSlideBgInPad)}
                        className="px-2.5 py-1 rounded text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300"
                      >
                        Fond Slide : {showSlideBgInPad ? 'Visible' : 'Noir'}
                      </button>
                      <button
                        onClick={handleUndoSketch}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        title="Annuler le dernier trait"
                      >
                        <Undo2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleClearSketch}
                        className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
                        title="Tout effacer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Barre d'outils de dessin */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                    {[
                      { id: 'pen', label: 'Crayon', icon: PenTool },
                      { id: 'highlighter', label: 'Surligneur', icon: Highlighter },
                      { id: 'arrow', label: 'Flèche', icon: ArrowRight },
                      { id: 'rect', label: 'Cadre', icon: Square },
                      { id: 'text', label: 'Texte', icon: Type },
                      { id: 'eraser', label: 'Gomme', icon: Eraser }
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setDrawTool(t.id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            drawTool === t.id
                              ? 'bg-amber-500 text-zinc-950 font-bold'
                              : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}

                    {/* Couleurs rapides */}
                    <div className="flex items-center gap-1 ml-auto">
                      {['#fbbf24', '#38bdf8', '#f43f5e', '#34d399', '#ffffff'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => setDrawColor(hex)}
                          style={{ backgroundColor: hex }}
                          className={`w-5 h-5 rounded-full border ${
                            drawColor === hex ? 'ring-2 ring-white scale-110' : 'border-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {drawTool === 'text' && (
                    <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
                      <span className="text-xs text-zinc-400">Texte à poser au clic :</span>
                      <input
                        type="text"
                        value={customTextLabel}
                        onChange={(e) => setCustomTextLabel(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Zone de dessin 16:9 avec touch-action: none pour ne pas scroller sur téléphone */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-zinc-700 bg-zinc-950 select-none">
                    {showSlideBgInPad && (
                      <div className="absolute inset-0 opacity-30 pointer-events-none">
                        {renderSlideCanvas(currentSlide)}
                      </div>
                    )}
                    <canvas
                      ref={canvasRef}
                      width={960}
                      height={540}
                      onMouseDown={handleDrawStart}
                      onMouseMove={handleDrawMove}
                      onMouseUp={handleDrawEnd}
                      onMouseLeave={handleDrawEnd}
                      onTouchStart={handleDrawStart}
                      onTouchMove={handleDrawMove}
                      onTouchEnd={handleDrawEnd}
                      style={{ touchAction: 'none' }}
                      className="relative z-10 w-full h-full cursor-crosshair"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Astuce : Dessine librement avec ton doigt sur ton téléphone. Ton croquis s'affiche aussi sur la slide 16:9 et peut être analysé par le Coach IA à droite !
                  </p>
                </div>
              </div>

              {/* COLONNE DROITE (5 cols) : DISCUSSION & AVIS FRANC DU COACH IA */}
              <div className="lg:col-span-5 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col h-[680px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Coach TEDx (Avis Franc & Pertinent)
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Critique constructive de ton anglais, du rythme & de ton dessin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons d'analyse rapide en 1 clic */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button
                    onClick={() =>
                      askPertinentCoach(
                        "Donne-moi un avis franc (points forts et points faibles) sur mon texte de cette slide. Est-ce que c'est percutant ?",
                        false
                      )
                    }
                    disabled={isAiLoading}
                    className="text-[11px] bg-zinc-950 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  >
                    ⚡ Avis franc (Bon & Mauvais)
                  </button>
                  <button
                    onClick={() =>
                      askPertinentCoach(
                        "Est-ce que mon anglais sonne naturel à l'oral pour un jeune qui parle à un public, ou est-ce que certaines phrases sont maladroites ?",
                        false
                      )
                    }
                    disabled={isAiLoading}
                    className="text-[11px] bg-zinc-950 hover:bg-zinc-800 border border-sky-500/40 text-sky-300 px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  >
                    🎙️ Ça sonne naturel à l'oral ?
                  </button>
                  <button
                    onClick={() =>
                      askPertinentCoach(
                        "Regarde mon croquis de slide et mon texte : est-ce que l'idée visuelle + le petit personnage animé fonctionnent bien ensemble ?",
                        true
                      )
                    }
                    disabled={isAiLoading}
                    className="text-[11px] bg-zinc-950 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  >
                    🎨 Critique mon dessin + texte
                  </button>
                </div>

                {/* Fil de discussion avec le Coach */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {aiMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100 ml-6'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-200 mr-2'
                      }`}
                    >
                      {msg.slideRef && (
                        <div className="text-[10px] font-mono uppercase text-amber-400 mb-1">
                          {msg.slideRef}
                        </div>
                      )}
                      {msg.text}
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyse franche de ton texte et de ta slide en cours...
                    </div>
                  )}
                </div>

                {/* Champ de discussion libre */}
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isAiLoading) {
                        askPertinentCoach(null, true);
                      }
                    }}
                    placeholder="Discute d'une idée, demande une tournure en anglais..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => askPertinentCoach(null, true)}
                    disabled={isAiLoading}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 3 : PLAN HIÉRARCHISÉ COMPLET (ARCHITECTURE DU TALK)
        ================================================================== */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    Structure Narrative & Visuelle Complète
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-white mt-1">
                    Architecture Hiérarchisée de ta Présentation (5 Actes • 8 Slides)
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {slides.map((s, idx) => (
                  <div
                    key={s.id}
                    className="bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 rounded-xl p-4 sm:p-5 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center">
                          S{s.id}
                        </span>
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                            {s.act}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white">{s.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300">
                          {s.timeRange} ({s.durationLabel})
                        </span>
                        <button
                          onClick={() => {
                            setCurrentSlideIndex(idx);
                            setActiveTab('atelier');
                          }}
                          className="text-xs px-3 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 font-medium transition-all"
                        >
                          Écrire / Dessiner →
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-zinc-900 text-xs">
                      <div className="bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
                        <div className="font-mono uppercase text-zinc-400 mb-1.5 font-semibold">
                          1. Idée Directrice & Sous-parties
                        </div>
                        <p className="text-amber-300 font-semibold mb-2">
                          {s.hierarchyDetails.mainPoint}
                        </p>
                        <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                          {s.hierarchyDetails.subPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
                        <div className="font-mono uppercase text-sky-400 mb-1.5 font-semibold">
                          2. Concept Visuel Cinématique
                        </div>
                        <p className="text-zinc-200 leading-relaxed mb-2">
                          {s.visualConcept}
                        </p>
                        <p className="text-zinc-400 italic">
                          Astuce : {s.pptTips}
                        </p>
                      </div>

                      <div className="bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60 flex flex-col justify-between">
                        <div>
                          <div className="font-mono uppercase text-emerald-400 mb-1.5 font-semibold">
                            3. Repères en Anglais (Oral)
                          </div>
                          <ul className="space-y-1 text-zinc-200 font-medium">
                            {s.anchors.map((a, i) => (
                              <li key={i}>• {a}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-800 text-amber-200/90 italic">
                          Pont : {s.bridgePhrase}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 4 : FICHE ANTISÈCHE JOUR J (POCKET CUE CARD)
        ================================================================== */}
        {activeTab === 'cheatsheet' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-4 mb-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    Lecture Rapide sur Téléphone 30 Secondes Avant de Monter sur Scène
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    Ta Fiche Antisèche Ultra-Compacte (Zéro Perte de Fil)
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slides.map((s) => (
                  <div
                    key={s.id}
                    className={`p-4 rounded-xl border ${
                      s.palette === 'shadow'
                        ? 'bg-slate-950/90 border-sky-900/60'
                        : s.palette === 'pivot'
                        ? 'bg-stone-950 border-amber-500/70 ring-1 ring-amber-500/30'
                        : s.palette === 'golden'
                        ? 'bg-amber-950/25 border-amber-600/40'
                        : 'bg-zinc-950 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-bold text-amber-400">
                        SLIDE {s.id} • {s.actShort.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                        {s.timeRange}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white mb-2">{s.title}</div>

                    <ol className="space-y-1 text-xs text-zinc-200 mb-3">
                      {s.anchors.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-mono font-bold">{idx + 1}.</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
                      <span className="italic text-amber-200/80">{s.bridgePhrase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          BARRE DE NAVIGATION BASSE SPÉCIALE TÉLÉPHONE (MOBILE BOTTOM NAV)
      ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'studio', label: 'Scène 16:9', icon: Eye },
          { id: 'atelier', label: 'Atelier & IA', icon: PenTool },
          { id: 'hierarchy', label: 'Plan', icon: LayoutList },
          { id: 'cheatsheet', label: 'Antisèche', icon: FileText }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}