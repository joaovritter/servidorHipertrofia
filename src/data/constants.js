// =============================================================================
//  CONSTANTES DO SISTEMA
//  Tipos de série, dados mockados de sessão, volume, 1RM, e feedback da IA.
//  Em produção: substituídos por chamadas GET/POST ao backend via services/.
// =============================================================================

// --- Tipos de Série (Set Types) ---
// REGRA DE NEGÓCIO CRÍTICA:
//   "warmup"  → NÃO conta para volume
//   "feeder"  → NÃO conta para volume
//   "work"    → CONTA para volume e análise da IA
export const SET_TYPES = [
  { value: "warmup", label: "Warmup",  short: "W",  color: "text-amber-400",  bg: "bg-amber-400/10", border: "border-amber-400/30" },
  { value: "feeder", label: "Feeder",  short: "F",  color: "text-blue-400",   bg: "bg-blue-400/10",  border: "border-blue-400/30"  },
  { value: "work",   label: "Work",    short: "✓",  color: "text-emerald-400",bg: "bg-emerald-400/10",border:"border-emerald-400/30"},
];

export const SET_TYPE_MAP = Object.fromEntries(SET_TYPES.map(t => [t.value, t]));

// --- Dados Mockados do Usuário ---
export const MOCK_USER = {
  id: "usr_001",
  name: "Alex Ferreira",
  initials: "AF",
  email: "alex@hypertrack.app",
  weight: 82,
  height: 178,
  age: 28,
  goal: "Hipertrofia Máxima",
  experience: "Avançado (5+ anos)",
  injuries: "Manguito rotador dir. (2022, recuperado)",
  onboarded: true,
};

// --- Grupamentos Musculares ---
export const MUSCLE_GROUPS = [
  { id: "chest",     label: "Peito",     icon: "🏋️" },
  { id: "back",      label: "Costas",    icon: "🧎" },
  { id: "shoulders", label: "Ombros",    icon: "💪" },
  { id: "legs",      label: "Pernas",    icon: "🦵" },
  { id: "biceps",    label: "Bíceps",    icon: "💪" },
  { id: "triceps",   label: "Tríceps",   icon: "💪" },
];

// --- Dados de Volume Semanal (Gráficos) ---
export const VOLUME_DATA = [
  { sem: "S1",  Peitoral: 16, Costas: 20, Pernas: 24, Ombros: 12, Braços: 10 },
  { sem: "S2",  Peitoral: 18, Costas: 22, Pernas: 26, Ombros: 14, Braços: 12 },
  { sem: "S3",  Peitoral: 20, Costas: 24, Pernas: 28, Ombros: 16, Braços: 14 },
  { sem: "S4",  Peitoral: 10, Costas: 12, Pernas: 14, Ombros:  8, Braços:  6 },
  { sem: "S5",  Peitoral: 22, Costas: 26, Pernas: 30, Ombros: 16, Braços: 14 },
  { sem: "S6",  Peitoral: 20, Costas: 24, Pernas: 28, Ombros: 18, Braços: 14 },
  { sem: "S7",  Peitoral: 24, Costas: 28, Pernas: 32, Ombros: 18, Braços: 16 },
  { sem: "S8",  Peitoral: 12, Costas: 14, Pernas: 16, Ombros:  8, Braços:  6 },
  { sem: "S9",  Peitoral: 26, Costas: 30, Pernas: 34, Ombros: 20, Braços: 16 },
  { sem: "S10", Peitoral: 24, Costas: 28, Pernas: 32, Ombros: 18, Braços: 16 },
  { sem: "S11", Peitoral: 28, Costas: 32, Pernas: 36, Ombros: 20, Braços: 18 },
  { sem: "S12", Peitoral: 26, Costas: 30, Pernas: 34, Ombros: 20, Braços: 16 },
];

// --- Dados de 1RM Estimado (Gráficos) ---
export const ONE_RM_DATA = [
  { label: "Jan W1", bp: 87.5, sq: 120  },
  { label: "Jan W3", bp: 90,   sq: 122.5},
  { label: "Fev W1", bp: 90,   sq: 125  },
  { label: "Fev W3", bp: 92.5, sq: 127.5},
  { label: "Mar W1", bp: 95,   sq: 130  },
  { label: "Mar W3", bp: 95,   sq: 130  },
  { label: "Abr W1", bp: 97.5, sq: 132.5},
  { label: "Abr W3", bp: 100,  sq: 135  },
  { label: "Mai W1", bp: 100,  sq: 137.5},
  { label: "Mai W3", bp: 105,  sq: 140  },
  { label: "Jun W1", bp: 107.5,sq: 142.5},
  { label: "Jun W3", bp: 110,  sq: 145  },
];

// --- Feedback Mock da IA ---
export const AI_FEEDBACK_MOCK = {
  sessionScore: 91,
  sessionLabel: "Sessão Elite",
  completedAt: "2025-05-19T21:14:00",
  workSetsAnalyzed: 13,
  totalVolume_kg: 6840,
  avgRIR: 2.1,
  summary:
    "Sessão de Peito & Tríceps executada com excelência. Volume de work sets (13 séries) dentro da zona MAV–MRV para o seu nível. RIR médio de 2.1 confirma intensidade ótima sem comprometer a recuperação.",
  insights: [
    { type: "positive", title: "Sobrecarga Progressiva Confirmada",
      body: "+2.5 kg no Supino Reto comparado à última sessão. 1RM estimado atual: 110 kg (+1.4%)." },
    { type: "positive", title: "Consistência entre Séries",
      body: "Variação de reps < 15% entre as work sets do Supino Reto — boa gestão de fadiga intrasessão." },
    { type: "warning", title: "Atenção: RIR Abaixo do Alvo no Tríceps Francês",
      body: "Série 3 registrada com RIR próximo a 0. Reduza –2 kg na série de fechamento na próxima sessão." },
    { type: "info", title: "Volume Semanal de Peito: 13/16 séries da quota MAV",
      body: "Você atingiu 81% do volume máximo adaptativo para Peitoral nesta semana." },
  ],
  nextSession: {
    date: "Segunda, 26/05/2025",
    recommendations: [
      { exercise: "Supino Reto com Barra",        change: "+2.5 kg",  target: "85 kg × 8 reps",   rir: "RIR 2",   type: "increase" },
      { exercise: "Supino Inclinado c/ Halteres", change: "Manter",   target: "30 kg × 10 reps",  rir: "RIR 2",   type: "maintain" },
      { exercise: "Crossover no Cabo",             change: "+2.5 kg",  target: "20 kg × 12 reps",  rir: "RIR 2",   type: "increase" },
      { exercise: "Tríceps Pulley — Corda",        change: "Manter",   target: "27.5 kg × 12 reps",rir: "RIR 2",   type: "maintain" },
      { exercise: "Tríceps Francês c/ Halter",     change: "–2 kg",    target: "14 kg × 10 reps",  rir: "RIR 2–3", type: "decrease" },
    ],
  },
};

// --- Divisão Semanal do Usuário ---
export const MOCK_DIVISION = [
  { day: 0, name: "Descanso Ativo",       type: "rest",     muscles: [],                                exercises: [] },
  { day: 1, name: "Peito, Ombro & Tríceps", type: "strength", muscles: ["chest","shoulders","triceps"],
    exercises: ["ex_bp","ex_ibp","ex_fly","ex_ohp","ex_dlat","ex_tpu","ex_fra"] },
  { day: 2, name: "Costas & Bíceps",      type: "strength", muscles: ["back","biceps"],
    exercises: ["ex_row","ex_pd","ex_cr","ex_fs","ex_bcb","ex_bch"] },
  { day: 3, name: "Pernas",               type: "strength", muscles: ["legs"],
    exercises: ["ex_sq","ex_lp","ex_rdl","ex_leg","ex_curl","ex_cc"] },
  { day: 4, name: "Descanso Ativo",       type: "rest",     muscles: [],                                exercises: [] },
  { day: 5, name: "Peito & Tríceps",      type: "strength", muscles: ["chest","triceps"],
    exercises: ["ex_bp","ex_ibp","ex_fly","ex_pec","ex_tpu","ex_fra","ex_skul"] },
  { day: 6, name: "Costas, Ombro & Bíceps", type: "strength", muscles: ["back","shoulders","biceps"],
    exercises: ["ex_row","ex_pd","ex_cr","ex_ohp","ex_rr","ex_bcb","ex_bch"] },
];

// --- Sessão de Treino do Dia (Segunda = Peito & Tríceps) ---
export const TODAY_SESSION = {
  divisionDay: 1,
  sessionName: "Peito & Tríceps",
  date: "2025-05-19",
  exercises: [
    {
      id: "ex_bp", name: "Supino Reto com Barra", muscle: "Peitoral",
      tip: "Agarre na largura dos ombros. Descer controlado até tocar o peito. Explosão na subida.",
      sets: [
        { id: "s1", type: "warmup", weight: 40,   reps: 15, rir: null, aiTarget: null,                              completed: false },
        { id: "s2", type: "feeder", weight: 60,   reps: 8,  rir: null, aiTarget: null,                              completed: false },
        { id: "s3", type: "work",   weight: 82.5, reps: 0,  rir: null, aiTarget: { weight: 82.5, reps: 8,  rir: 2 }, completed: false },
        { id: "s4", type: "work",   weight: 82.5, reps: 0,  rir: null, aiTarget: { weight: 82.5, reps: 8,  rir: 2 }, completed: false },
        { id: "s5", type: "work",   weight: 80,   reps: 0,  rir: null, aiTarget: { weight: 80,   reps: 10, rir: 2 }, completed: false },
        { id: "s6", type: "work",   weight: 80,   reps: 0,  rir: null, aiTarget: { weight: 80,   reps: 10, rir: 2 }, completed: false },
      ],
    },
    {
      id: "ex_ibp", name: "Supino Inclinado c/ Halteres", muscle: "Peitoral Superior",
      tip: "Inclinação 30–45°. Foco na porção clavicular. Não deixe o cotovelo passar da linha do ombro.",
      sets: [
        { id: "s7", type: "warmup", weight: 16,   reps: 12, rir: null, aiTarget: null,                              completed: false },
        { id: "s8", type: "work",   weight: 30,   reps: 0,  rir: null, aiTarget: { weight: 30,   reps: 10, rir: 2 }, completed: false },
        { id: "s9", type: "work",   weight: 30,   reps: 0,  rir: null, aiTarget: { weight: 30,   reps: 10, rir: 2 }, completed: false },
        { id:"s10", type: "work",   weight: 28,   reps: 0,  rir: null, aiTarget: { weight: 28,   reps: 12, rir: 2 }, completed: false },
      ],
    },
    {
      id: "ex_fly", name: "Crossover no Cabo", muscle: "Peitoral",
      tip: "Adução completa com leve rotação interna. Contração máxima no centro. Retorno controlado.",
      sets: [
        { id:"s11", type: "work",   weight: 17.5, reps: 0,  rir: null, aiTarget: { weight: 17.5, reps: 12, rir: 2 }, completed: false },
        { id:"s12", type: "work",   weight: 17.5, reps: 0,  rir: null, aiTarget: { weight: 17.5, reps: 12, rir: 2 }, completed: false },
        { id:"s13", type: "work",   weight: 15,   reps: 0,  rir: null, aiTarget: { weight: 15,   reps: 15, rir: 2 }, completed: false },
      ],
    },
    {
      id: "ex_tpu", name: "Tríceps Pulley — Corda", muscle: "Tríceps",
      tip: "Cotovelos fixos ao tronco. Extensão completa com supinação ao final da corda.",
      sets: [
        { id:"s14", type: "warmup", weight: 15,   reps: 15, rir: null, aiTarget: null,                              completed: false },
        { id:"s15", type: "work",   weight: 27.5, reps: 0,  rir: null, aiTarget: { weight: 27.5, reps: 12, rir: 2 }, completed: false },
        { id:"s16", type: "work",   weight: 27.5, reps: 0,  rir: null, aiTarget: { weight: 27.5, reps: 12, rir: 2 }, completed: false },
        { id:"s17", type: "work",   weight: 25,   reps: 0,  rir: null, aiTarget: { weight: 25,   reps: 15, rir: 2 }, completed: false },
      ],
    },
    {
      id: "ex_fra", name: "Tríceps Francês c/ Halter", muscle: "Tríceps Longo",
      tip: "Amplitude máxima na fase excêntrica. Manter cotovelos apontados para cima. Sem arquear a lombar.",
      sets: [
        { id:"s18", type: "work",   weight: 16,   reps: 0,  rir: null, aiTarget: { weight: 16,   reps: 10, rir: 2 }, completed: false },
        { id:"s19", type: "work",   weight: 16,   reps: 0,  rir: null, aiTarget: { weight: 16,   reps: 10, rir: 2 }, completed: false },
        { id:"s20", type: "work",   weight: 14,   reps: 0,  rir: null, aiTarget: { weight: 14,   reps: 12, rir: 3 }, completed: false },
      ],
    },
  ],
};
