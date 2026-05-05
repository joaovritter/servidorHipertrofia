// =============================================================================
//  BANCO DE EXERCÍCIOS — Dados Estáticos
//  Em produção: GET /api/exercises?category=chest&limit=50
//  Estrutura normalizada: grupo muscular primário/secundário + equipamento + tipo
// =============================================================================

export const EXERCISE_BANK = {
  chest: [
    { id: "ex_bp",  name: "Supino Reto com Barra",       muscles: ["Peitoral","Tríceps","Anterior"],  equipment: "Barra",    type: "compound" },
    { id: "ex_ibp", name: "Supino Inclinado com Barra",   muscles: ["Peitoral Superior","Tríceps"],    equipment: "Barra",    type: "compound" },
    { id: "ex_dbp", name: "Supino Inclinado c/ Halteres", muscles: ["Peitoral Superior"],              equipment: "Halteres", type: "compound" },
    { id: "ex_fly", name: "Crossover no Cabo",            muscles: ["Peitoral"],                       equipment: "Cabo",     type: "isolation" },
    { id: "ex_pec", name: "Pec Deck (Voador)",            muscles: ["Peitoral"],                       equipment: "Máquina",  type: "isolation" },
    { id: "ex_dip", name: "Paralelas (Chest Dip)",        muscles: ["Peitoral Inferior","Tríceps"],     equipment: "Barras",   type: "compound" },
  ],
  back: [
    { id: "ex_dl",  name: "Levantamento Terra",           muscles: ["Lombar","Glúteo","Trapézio"],     equipment: "Barra",    type: "compound" },
    { id: "ex_row", name: "Remada Curvada com Barra",     muscles: ["Latíssimo","Romboides","Bíceps"], equipment: "Barra",    type: "compound" },
    { id: "ex_pd",  name: "Puxada Frontal (Pulley)",      muscles: ["Latíssimo","Bíceps"],             equipment: "Cabo",     type: "compound" },
    { id: "ex_cr",  name: "Remada Unilateral c/ Halter",  muscles: ["Latíssimo","Romboides"],          equipment: "Halteres", type: "compound" },
    { id: "ex_fs",  name: "Face Pull no Cabo",            muscles: ["Posterior","Trapézio Médio"],     equipment: "Cabo",     type: "isolation" },
  ],
  legs: [
    { id: "ex_sq",  name: "Agachamento Livre (Squat)",    muscles: ["Quadríceps","Glúteo","Core"],     equipment: "Barra",    type: "compound" },
    { id: "ex_lp",  name: "Leg Press 45°",                muscles: ["Quadríceps","Glúteo"],            equipment: "Máquina",  type: "compound" },
    { id: "ex_rdl", name: "Stiff (RDL)",                  muscles: ["Posterior","Glúteo"],             equipment: "Barra",    type: "compound" },
    { id: "ex_leg", name: "Extensora",                    muscles: ["Quadríceps"],                     equipment: "Máquina",  type: "isolation" },
    { id: "ex_curl",name: "Mesa Flexora",                  muscles: ["Posterior"],                      equipment: "Máquina",  type: "isolation" },
    { id: "ex_cc",  name: "Elevação de Panturrilha",      muscles: ["Gastrocnêmio","Sóleo"],           equipment: "Máquina",  type: "isolation" },
  ],
  shoulders: [
    { id: "ex_ohp", name: "Desenvolvimento Militar",      muscles: ["Deltoide Anterior","Tríceps"],    equipment: "Barra",    type: "compound" },
    { id: "ex_dlat",name: "Elevação Lateral",             muscles: ["Deltoide Lateral"],               equipment: "Halteres", type: "isolation" },
    { id: "ex_rr",  name: "Remada Alta",                  muscles: ["Deltoide Lateral","Trapézio"],    equipment: "Halteres", type: "compound" },
  ],
  triceps: [
    { id: "ex_tpu", name: "Tríceps Pulley — Corda",       muscles: ["Tríceps"],                        equipment: "Cabo",     type: "isolation" },
    { id: "ex_fra", name: "Tríceps Francês c/ Halter",   muscles: ["Tríceps Longo"],                  equipment: "Halteres", type: "isolation" },
    { id: "ex_skul",name: "Skull Crusher",                muscles: ["Tríceps"],                        equipment: "Barra",    type: "isolation" },
  ],
  biceps: [
    { id: "ex_bcb", name: "Rosca Direta com Barra",       muscles: ["Bíceps"],                         equipment: "Barra",    type: "isolation" },
    { id: "ex_bch", name: "Rosca Alternada c/ Halter",    muscles: ["Bíceps","Braquial"],              equipment: "Halteres", type: "isolation" },
    { id: "ex_bcc", name: "Rosca Concentrada",            muscles: ["Bíceps"],                         equipment: "Halteres", type: "isolation" },
  ],
};
