/* Ekinox Gamos — données de démonstration.
   Les prix, stocks, FPS et numéros de série sont fictifs. Les adresses, horaires et
   numéros de téléphone viennent de la bannière et des pages publiques d'Ekinox Gamos. */
window.EKG = {
  shop: {
    name: "Ekinox Gamos",
    whatsapp: "261346117211",
    email: "ekinoxgamos@yahoo.com",
    facebook: "https://www.facebook.com/p/Ekinox-Gamos-100064281385706/",
    assemblyFee: 150000,
    depositRate: 0.2,
    deliveryTana: 15000
  },

  shops: [
    {
      id: "mahamasina", name: "Showroom Mahamasina", short: "Mahamasina",
      address: "Mahamasina, près de Gastro Pizza", city: "Antananarivo",
      phone: "+261 34 61 172 11", tel: "+261346117211",
      role: "Showroom, atelier d'assemblage et retrait des commandes",
      maps: "https://www.google.com/maps/search/?api=1&query=Gastro+Pizza+Mahamasina+Antananarivo"
    },
    {
      id: "andravoahangy", name: "Annexe Andravoahangy", short: "Andravoahangy",
      address: "Immeuble Raitra, box 5, Andravoahangy Ambony", city: "Antananarivo",
      phone: "+261 34 02 056 56", tel: "+261340205656",
      role: "Composants, périphériques et retrait des commandes",
      maps: "https://www.google.com/maps/search/?api=1&query=Immeuble+Raitra+Andravoahangy+Antananarivo"
    }
  ],

  /* Horaires : jour de la semaine (0 = dimanche) -> [ouverture, fermeture] en heures décimales */
  hours: { 0: null, 1: [8.5, 17], 2: [8.5, 17], 3: [8.5, 17], 4: [8.5, 17], 5: [8.5, 17], 6: [8.5, 12] },

  games: [
    { id: "valorant", name: "Valorant" },
    { id: "eafc", name: "EA Sports FC 26" },
    { id: "fortnite", name: "Fortnite" },
    { id: "gtav", name: "GTA V" },
    { id: "warzone", name: "Call of Duty Warzone" },
    { id: "cyberpunk", name: "Cyberpunk 2077" }
  ],

  pcs: [
    {
      id: "aube", name: "AUBE", line: "1080p compétitif", res: "1080p", resLabel: "1080p élevé",
      photo: "pc-dark", price: 3290000, watts: 320,
      stock: { mahamasina: 3, andravoahangy: 1 },
      specs: { cpu: "AMD Ryzen 5 5600", gpu: "GeForce RTX 5050 8 Go", ram: "16 Go DDR4 3200", storage: "SSD NVMe 512 Go", mb: "Carte mère B550M", psu: "550 W 80+ Bronze", cooling: "Ventirad tour 120 mm", case: "Boîtier micro-ATX vitré, 3 ventilateurs" },
      fps: { valorant: 260, eafc: 180, fortnite: 120, gtav: 130, warzone: 85, cyberpunk: 55 },
      pitch: "L'entrée dans l'esport : Valorant, EA FC et Fortnite à haute fréquence, sans exploser le budget."
    },
    {
      id: "zenith", name: "ZÉNITH", line: "1440p fluide", res: "1440p", resLabel: "1440p élevé",
      photo: "pc-lianli", price: 5890000, watts: 420, badge: "Le plus choisi",
      stock: { mahamasina: 1, andravoahangy: 2 },
      specs: { cpu: "AMD Ryzen 5 7600", gpu: "GeForce RTX 5060 Ti 16 Go", ram: "32 Go DDR5 6000", storage: "SSD NVMe 1 To", mb: "Carte mère B650", psu: "650 W 80+ Gold", cooling: "Watercooling AIO 240 mm", case: "Boîtier panoramique vitré, 7 ventilateurs ARGB" },
      fps: { valorant: 300, eafc: 190, fortnite: 130, gtav: 140, warzone: 100, cyberpunk: 65 },
      pitch: "Le meilleur équilibre de la gamme : 1440p fluide sur tous les jeux récents, avec 16 Go de mémoire vidéo."
    },
    {
      id: "equinoxe", name: "ÉQUINOXE", line: "Édition signature noir & jaune", res: "1440p", resLabel: "1440p ultra",
      photo: "pc-glass", price: 7990000, watts: 480, badge: "Signature",
      stock: { mahamasina: 2, andravoahangy: 0 },
      specs: { cpu: "AMD Ryzen 7 7700", gpu: "GeForce RTX 5070 12 Go", ram: "32 Go DDR5 6000", storage: "SSD NVMe 2 To", mb: "Carte mère B650", psu: "750 W 80+ Gold", cooling: "Watercooling AIO 280 mm", case: "Boîtier noir double vitrage, éclairage jaune EKG" },
      fps: { valorant: 360, eafc: 220, fortnite: 150, gtav: 160, warzone: 120, cyberpunk: 80 },
      pitch: "La machine aux couleurs de la maison : boîtier noir, éclairage jaune EKG et plaque numérotée."
    },
    {
      id: "eclipse", name: "ÉCLIPSE", line: "Streaming & création", res: "1440p", resLabel: "1440p ultra",
      photo: "pc-inside", price: 10400000, watts: 560,
      stock: { mahamasina: 1, andravoahangy: 0 },
      specs: { cpu: "AMD Ryzen 9 9900X", gpu: "GeForce RTX 5070 Ti 16 Go", ram: "64 Go DDR5 6000", storage: "2 × SSD NVMe 2 To", mb: "Carte mère X870", psu: "850 W 80+ Gold", cooling: "Watercooling AIO 360 mm", case: "Boîtier airflow, câblage gainé" },
      fps: { valorant: 400, eafc: 240, fortnite: 170, gtav: 175, warzone: 140, cyberpunk: 95 },
      pitch: "Jouer, streamer et monter en même temps : 12 cœurs, 64 Go de mémoire et un encodeur vidéo dédié."
    },
    {
      id: "solstice", name: "SOLSTICE", line: "4K ultime", res: "4K", resLabel: "4K ultra",
      photo: "pc-purple", price: 12900000, watts: 620, arrival: "12 déc.",
      stock: { mahamasina: 0, andravoahangy: 0 },
      specs: { cpu: "AMD Ryzen 7 9800X3D", gpu: "GeForce RTX 5080 16 Go", ram: "32 Go DDR5 6000 CL30", storage: "SSD NVMe Gen4 2 To", mb: "Carte mère X870", psu: "1000 W 80+ Gold ATX 3.1", cooling: "Watercooling AIO 360 mm", case: "Boîtier panoramique, 9 ventilateurs" },
      fps: { valorant: 330, eafc: 160, fortnite: 110, gtav: 130, warzone: 95, cyberpunk: 60 },
      pitch: "Le haut de gamme sans compromis pour la 4K. Réservable dès maintenant sur le prochain arrivage."
    }
  ],

  categories: [
    { id: "gpu", name: "Cartes graphiques", photo: "gpu-rtx" },
    { id: "cpu", name: "Processeurs", photo: "carte-mere" },
    { id: "mb", name: "Cartes mères", photo: "carte-mere" },
    { id: "ram", name: "Mémoire" },
    { id: "storage", name: "Stockage" },
    { id: "psu", name: "Alimentations" },
    { id: "case", name: "Boîtiers" },
    { id: "cooling", name: "Refroidissement" },
    { id: "monitor", name: "Écrans", photo: "peripheriques" },
    { id: "periph", name: "Périphériques", photo: "peripheriques" },
    { id: "ups", name: "Onduleurs & protection" }
  ],

  parts: [
    /* Processeurs */
    { id: "cpu-r5-5600", cat: "cpu", name: "AMD Ryzen 5 5600", spec: "6 cœurs · 12 threads · AM4 · 65 W", price: 650000, socket: "AM4", tdp: 65, stock: { mahamasina: 6, andravoahangy: 4 } },
    { id: "cpu-r5-7600", cat: "cpu", name: "AMD Ryzen 5 7600", spec: "6 cœurs · 12 threads · AM5 · 65 W", price: 1150000, socket: "AM5", tdp: 65, stock: { mahamasina: 4, andravoahangy: 2 } },
    { id: "cpu-r7-7700", cat: "cpu", name: "AMD Ryzen 7 7700", spec: "8 cœurs · 16 threads · AM5 · 65 W", price: 1550000, socket: "AM5", tdp: 65, stock: { mahamasina: 3, andravoahangy: 1 } },
    { id: "cpu-r9-9900x", cat: "cpu", name: "AMD Ryzen 9 9900X", spec: "12 cœurs · 24 threads · AM5 · 120 W", price: 2500000, socket: "AM5", tdp: 120, stock: { mahamasina: 1, andravoahangy: 0 } },
    { id: "cpu-r7-9800x3d", cat: "cpu", name: "AMD Ryzen 7 9800X3D", spec: "8 cœurs · 3D V-Cache · AM5 · 120 W", price: 2900000, socket: "AM5", tdp: 120, stock: { mahamasina: 0, andravoahangy: 0 }, arrival: "12 déc." },
    { id: "cpu-i5-14400f", cat: "cpu", name: "Intel Core i5-14400F", spec: "10 cœurs · 16 threads · LGA1700 · 65 W", price: 1050000, socket: "LGA1700", tdp: 110, stock: { mahamasina: 2, andravoahangy: 3 } },
    { id: "cpu-i7-14700f", cat: "cpu", name: "Intel Core i7-14700F", spec: "20 cœurs · 28 threads · LGA1700 · 65 W", price: 2050000, socket: "LGA1700", tdp: 180, stock: { mahamasina: 1, andravoahangy: 1 } },

    /* Cartes mères */
    { id: "mb-b550m", cat: "mb", name: "Carte mère B550M micro-ATX", spec: "AM4 · DDR4 · PCIe 4.0 · micro-ATX", price: 520000, socket: "AM4", ramType: "DDR4", form: "mATX", stock: { mahamasina: 4, andravoahangy: 3 } },
    { id: "mb-b650m", cat: "mb", name: "Carte mère B650M micro-ATX", spec: "AM5 · DDR5 · Wi-Fi 6 · micro-ATX", price: 820000, socket: "AM5", ramType: "DDR5", form: "mATX", stock: { mahamasina: 2, andravoahangy: 2 } },
    { id: "mb-b650", cat: "mb", name: "Carte mère B650 ATX", spec: "AM5 · DDR5 · Wi-Fi 6E · ATX", price: 950000, socket: "AM5", ramType: "DDR5", form: "ATX", stock: { mahamasina: 3, andravoahangy: 1 } },
    { id: "mb-x870", cat: "mb", name: "Carte mère X870 ATX", spec: "AM5 · DDR5 · PCIe 5.0 · Wi-Fi 7 · ATX", price: 1650000, socket: "AM5", ramType: "DDR5", form: "ATX", stock: { mahamasina: 1, andravoahangy: 0 } },
    { id: "mb-b760m-d4", cat: "mb", name: "Carte mère B760M DDR4", spec: "LGA1700 · DDR4 · micro-ATX", price: 700000, socket: "LGA1700", ramType: "DDR4", form: "mATX", stock: { mahamasina: 2, andravoahangy: 2 } },
    { id: "mb-b760", cat: "mb", name: "Carte mère B760 ATX DDR5", spec: "LGA1700 · DDR5 · Wi-Fi 6 · ATX", price: 900000, socket: "LGA1700", ramType: "DDR5", form: "ATX", stock: { mahamasina: 1, andravoahangy: 1 } },

    /* Mémoire */
    { id: "ram-16-d4", cat: "ram", name: "16 Go DDR4 3200 (2 × 8 Go)", spec: "DDR4 · 3200 MHz · CL16", price: 210000, ramType: "DDR4", size: 16, stock: { mahamasina: 10, andravoahangy: 8 } },
    { id: "ram-32-d4", cat: "ram", name: "32 Go DDR4 3600 (2 × 16 Go)", spec: "DDR4 · 3600 MHz · CL18", price: 380000, ramType: "DDR4", size: 32, stock: { mahamasina: 5, andravoahangy: 4 } },
    { id: "ram-32-d5", cat: "ram", name: "32 Go DDR5 6000 (2 × 16 Go)", spec: "DDR5 · 6000 MHz · CL30 · EXPO", price: 560000, ramType: "DDR5", size: 32, stock: { mahamasina: 6, andravoahangy: 3 } },
    { id: "ram-64-d5", cat: "ram", name: "64 Go DDR5 6000 (2 × 32 Go)", spec: "DDR5 · 6000 MHz · CL30", price: 1050000, ramType: "DDR5", size: 64, stock: { mahamasina: 2, andravoahangy: 0 } },

    /* Cartes graphiques */
    { id: "gpu-5050", cat: "gpu", name: "GeForce RTX 5050 8 Go", spec: "8 Go GDDR6 · DLSS 4 · 130 W", price: 1350000, tdp: 130, length: 230, tier: 1, stock: { mahamasina: 3, andravoahangy: 2 } },
    { id: "gpu-5060", cat: "gpu", name: "GeForce RTX 5060 8 Go", spec: "8 Go GDDR7 · DLSS 4 · 145 W", price: 1650000, tdp: 145, length: 240, tier: 2, stock: { mahamasina: 4, andravoahangy: 2 } },
    { id: "gpu-9060xt", cat: "gpu", name: "Radeon RX 9060 XT 16 Go", spec: "16 Go GDDR6 · FSR 4 · 160 W", price: 2300000, tdp: 160, length: 260, tier: 3, stock: { mahamasina: 2, andravoahangy: 1 } },
    { id: "gpu-5060ti", cat: "gpu", name: "GeForce RTX 5060 Ti 16 Go", spec: "16 Go GDDR7 · DLSS 4 · 180 W", price: 2550000, tdp: 180, length: 250, tier: 3, stock: { mahamasina: 3, andravoahangy: 2 } },
    { id: "gpu-5070", cat: "gpu", name: "GeForce RTX 5070 12 Go", spec: "12 Go GDDR7 · DLSS 4 · 250 W", price: 3300000, tdp: 250, length: 290, tier: 4, stock: { mahamasina: 2, andravoahangy: 1 } },
    { id: "gpu-9070", cat: "gpu", name: "Radeon RX 9070 16 Go", spec: "16 Go GDDR6 · FSR 4 · 220 W", price: 3500000, tdp: 220, length: 290, tier: 4, stock: { mahamasina: 1, andravoahangy: 0 } },
    { id: "gpu-5070ti", cat: "gpu", name: "GeForce RTX 5070 Ti 16 Go", spec: "16 Go GDDR7 · DLSS 4 · 300 W", price: 4900000, tdp: 300, length: 320, tier: 5, stock: { mahamasina: 1, andravoahangy: 0 } },
    { id: "gpu-5080", cat: "gpu", name: "GeForce RTX 5080 16 Go", spec: "16 Go GDDR7 · DLSS 4 · 360 W", price: 7200000, tdp: 360, length: 335, tier: 6, stock: { mahamasina: 0, andravoahangy: 0 }, arrival: "12 déc." },

    /* Stockage */
    { id: "ssd-512", cat: "storage", name: "SSD NVMe Gen3 512 Go", spec: "M.2 2280 · 3 500 Mo/s", price: 190000, stock: { mahamasina: 12, andravoahangy: 9 } },
    { id: "ssd-1t", cat: "storage", name: "SSD NVMe Gen4 1 To", spec: "M.2 2280 · 7 000 Mo/s", price: 330000, stock: { mahamasina: 8, andravoahangy: 6 } },
    { id: "ssd-2t", cat: "storage", name: "SSD NVMe Gen4 2 To", spec: "M.2 2280 · 7 000 Mo/s", price: 620000, stock: { mahamasina: 4, andravoahangy: 2 } },
    { id: "hdd-2t", cat: "storage", name: "Disque dur 2 To 7 200 tr/min", spec: "3,5 pouces · SATA · stockage de masse", price: 290000, stock: { mahamasina: 5, andravoahangy: 7 } },

    /* Alimentations */
    { id: "psu-550", cat: "psu", name: "Alimentation 550 W 80+ Bronze", spec: "550 W · semi-modulaire", price: 280000, watts: 550, stock: { mahamasina: 5, andravoahangy: 4 } },
    { id: "psu-650", cat: "psu", name: "Alimentation 650 W 80+ Gold", spec: "650 W · modulaire", price: 420000, watts: 650, stock: { mahamasina: 4, andravoahangy: 2 } },
    { id: "psu-750", cat: "psu", name: "Alimentation 750 W 80+ Gold", spec: "750 W · modulaire · ATX 3.1", price: 520000, watts: 750, stock: { mahamasina: 3, andravoahangy: 1 } },
    { id: "psu-850", cat: "psu", name: "Alimentation 850 W 80+ Gold", spec: "850 W · modulaire · ATX 3.1", price: 640000, watts: 850, stock: { mahamasina: 2, andravoahangy: 1 } },
    { id: "psu-1000", cat: "psu", name: "Alimentation 1000 W 80+ Gold", spec: "1000 W · modulaire · ATX 3.1", price: 890000, watts: 1000, stock: { mahamasina: 1, andravoahangy: 0 } },

    /* Boîtiers */
    { id: "case-rgb-atx", cat: "case", name: "Boîtier vide RGB ATX", spec: "ATX · vitré · 3 ventilateurs RGB · GPU 320 mm max", price: 170000, forms: ["ATX", "mATX"], gpuMax: 320, note: "Prix publié par Ekinox", stock: { mahamasina: 6, andravoahangy: 5 } },
    { id: "case-matx", cat: "case", name: "Boîtier micro-ATX vitré", spec: "micro-ATX · compact · GPU 280 mm max", price: 230000, forms: ["mATX"], gpuMax: 280, stock: { mahamasina: 4, andravoahangy: 3 } },
    { id: "case-airflow", cat: "case", name: "Boîtier airflow ATX", spec: "ATX · façade mesh · GPU 380 mm max", price: 420000, forms: ["ATX", "mATX"], gpuMax: 380, stock: { mahamasina: 2, andravoahangy: 1 } },
    { id: "case-pano", cat: "case", name: "Boîtier panoramique double vitrage", spec: "ATX · aquarium · GPU 360 mm max", price: 480000, forms: ["ATX", "mATX"], gpuMax: 360, stock: { mahamasina: 3, andravoahangy: 0 } },

    /* Refroidissement */
    { id: "cool-tower", cat: "cooling", name: "Ventirad tour 120 mm", spec: "4 caloducs · jusqu'à 150 W", price: 120000, maxTdp: 150, stock: { mahamasina: 7, andravoahangy: 5 } },
    { id: "cool-aio240", cat: "cooling", name: "Watercooling AIO 240 mm ARGB", spec: "240 mm · jusqu'à 220 W", price: 380000, maxTdp: 220, stock: { mahamasina: 3, andravoahangy: 2 } },
    { id: "cool-aio360", cat: "cooling", name: "Watercooling AIO 360 mm", spec: "360 mm · jusqu'à 280 W", price: 560000, maxTdp: 280, stock: { mahamasina: 2, andravoahangy: 0 } },

    /* Écrans */
    { id: "mon-24-180", cat: "monitor", name: "Écran 24\" IPS 180 Hz", spec: "1920 × 1080 · 1 ms · FreeSync", price: 780000, stock: { mahamasina: 4, andravoahangy: 3 } },
    { id: "mon-27-qhd", cat: "monitor", name: "Écran 27\" QHD 180 Hz", spec: "2560 × 1440 · IPS · G-Sync compatible", price: 1450000, stock: { mahamasina: 2, andravoahangy: 1 } },
    { id: "mon-27-4k", cat: "monitor", name: "Écran 27\" 4K 144 Hz", spec: "3840 × 2160 · IPS · HDR400", price: 2600000, stock: { mahamasina: 1, andravoahangy: 0 } },

    /* Périphériques */
    { id: "kb-meca", cat: "periph", name: "Clavier mécanique TKL", spec: "Switchs rouges · RGB · AZERTY", price: 220000, stock: { mahamasina: 8, andravoahangy: 6 } },
    { id: "mouse-gaming", cat: "periph", name: "Souris gaming 26 000 DPI", spec: "Capteur optique · 63 g", price: 150000, stock: { mahamasina: 9, andravoahangy: 7 } },
    { id: "headset", cat: "periph", name: "Casque gaming 7.1", spec: "Son surround · micro antibruit", price: 240000, stock: { mahamasina: 5, andravoahangy: 4 } },
    { id: "pad-xl", cat: "periph", name: "Tapis de souris XXL", spec: "900 × 400 mm · bords cousus", price: 60000, stock: { mahamasina: 12, andravoahangy: 10 } },

    /* Onduleurs & protection */
    { id: "ups-1200", cat: "ups", name: "Onduleur 1 200 VA", spec: "720 W · line-interactive · 4 prises", price: 390000, stock: { mahamasina: 6, andravoahangy: 4 } },
    { id: "ups-2000", cat: "ups", name: "Onduleur 2 000 VA", spec: "1 200 W · line-interactive · écran LCD", price: 690000, stock: { mahamasina: 3, andravoahangy: 1 } },
    { id: "surge", cat: "ups", name: "Parafoudre 8 prises", spec: "Protection surtension · 2 USB", price: 85000, stock: { mahamasina: 10, andravoahangy: 8 } }
  ],

  universes: [
    {
      id: "bureautique", name: "Bureautique & gestion", photo: "bureau-office",
      text: "Postes fiables pour la comptabilité, l'ERP et la suite Office. Livrés configurés, intégrés à votre réseau.",
      software: ["Microsoft 365", "Sage", "Odoo", "Navigateur"],
      config: { name: "Poste Bureau", items: ["Intel Core i5-14400", "16 Go DDR4", "SSD 512 Go", "Windows 11 Pro"], priceHT: 1950000 }
    },
    {
      id: "archi", name: "Architecture & BTP", photo: "archi-cad",
      text: "Stations pour la modélisation BIM et le rendu temps réel. Carte graphique certifiée pour les logiciels métier.",
      software: ["Revit", "ArchiCAD", "AutoCAD", "SketchUp", "Lumion"],
      config: { name: "Station Archi", items: ["AMD Ryzen 9 9900X", "GeForce RTX 5070 12 Go", "64 Go DDR5", "SSD 2 To"], priceHT: 8400000 }
    },
    {
      id: "creation3d", name: "3D & création", photo: "gpu-rtx",
      text: "Pour le rendu 3D, le montage vidéo et le motion design. Beaucoup de mémoire, beaucoup de cœurs, beaucoup de VRAM.",
      software: ["Blender", "Cinema 4D", "Unreal Engine", "DaVinci Resolve"],
      config: { name: "Station Créa 3D", items: ["AMD Ryzen 9 9900X", "GeForce RTX 5080 16 Go", "128 Go DDR5", "2 × SSD 2 To"], priceHT: 14500000 }
    },
    {
      id: "audio", name: "Audio & MAO", photo: "audio-studio",
      text: "Stations silencieuses à faible latence pour l'enregistrement et le mixage. Interface audio en option.",
      software: ["FL Studio", "Ableton Live", "Cubase", "Pro Tools"],
      config: { name: "Station Studio", items: ["AMD Ryzen 7 7700", "64 Go DDR5", "SSD 2 To + SSD 1 To", "Boîtier insonorisé"], priceHT: 5200000 }
    },
    {
      id: "serveurs", name: "Serveurs & stockage", photo: "serveurs",
      text: "Partage de fichiers, sauvegardes et serveur d'application pour PME. Installation, RAID et onduleur compris.",
      software: ["Partage de fichiers", "Sauvegarde", "Virtualisation", "NAS"],
      config: { name: "Serveur PME", items: ["Serveur tour", "64 Go ECC", "4 disques en RAID", "Onduleur 2 000 VA"], priceHT: null }
    },
    {
      id: "cyber", name: "Cybercafés & salles de jeux", photo: "cyber-club",
      text: "Parcs de postes gaming identiques, réseau et onduleurs, installés et configurés sur place à Tana.",
      software: ["Gestion de temps", "Steam", "Jeux en réseau", "Contrôle parental"],
      config: { name: "Pack 10 postes", items: ["10 × Ekinox Aube", "Switch et câblage", "Onduleurs", "Installation sur site"], priceHT: null }
    }
  ],

  arrivals: [
    { date: "12 déc.", name: "GeForce RTX 5080 16 Go", note: "4 unités · réservation avec 20 % d'acompte" },
    { date: "12 déc.", name: "AMD Ryzen 7 9800X3D", note: "6 unités · pour Solstice et sur mesure" },
    { date: "19 déc.", name: "Écrans 27\" QHD 180 Hz", note: "10 unités" }
  ],

  /* Passeports garantie de démonstration */
  passports: {
    "EKG-2026-0412": {
      pc: "zenith", sold: "2026-04-12", shop: "mahamasina", client: "R. A., Antananarivo",
      test: { duration: "24 h", cpuMax: "74 °C", gpuMax: "68 °C", result: "Stable, aucune erreur" },
      history: [
        { date: "2026-04-11", label: "Assemblage et câblage", detail: "Atelier Mahamasina" },
        { date: "2026-04-12", label: "Test de charge 24 h validé", detail: "CPU 74 °C max · GPU 68 °C max" },
        { date: "2026-04-12", label: "Livraison", detail: "Retrait au showroom" },
        { date: "2026-09-03", label: "Entretien", detail: "Nettoyage et changement de pâte thermique" }
      ]
    },
    "EKG-2025-1187": {
      pc: "aube", sold: "2025-10-02", shop: "andravoahangy", client: "H. R., Antsirabe",
      test: { duration: "24 h", cpuMax: "71 °C", gpuMax: "66 °C", result: "Stable, aucune erreur" },
      history: [
        { date: "2025-10-01", label: "Assemblage et câblage", detail: "Atelier Mahamasina" },
        { date: "2025-10-02", label: "Test de charge 24 h validé", detail: "CPU 71 °C max · GPU 66 °C max" },
        { date: "2025-10-04", label: "Livraison", detail: "Envoi en province par transporteur" }
      ]
    }
  },

  tickets: {
    "EKG-SAV-0007": { serial: "EKG-2026-0412", issue: "Ventilateur bruyant", opened: "2026-11-14", step: 2 }
  },
  ticketSteps: ["Demande reçue", "Diagnostic en atelier", "Réparation", "Prêt à retirer"],

  photos: {
    "hero-setup":   { by: "Branden Skeli", url: "https://unsplash.com/photos/zHzRrYV_Ars", alt: "Setup gaming avec plusieurs écrans et un PC éclairé" },
    "pc-lianli":    { by: "sdl sanjaya", url: "https://unsplash.com/photos/VBVtNgkA3ak", alt: "PC gamer vitré avec ventilateurs éclairés" },
    "pc-glass":     { by: "Andrey Matveev", url: "https://unsplash.com/photos/mspt8rZy0uI", alt: "Boîtier PC noir à panneaux vitrés" },
    "pc-dark":      { by: "Philipp Katzenberger", url: "https://unsplash.com/photos/ySEjbdYNrbw", alt: "PC compact éclairé dans une pièce sombre" },
    "pc-inside":    { by: "Andrey Matveev", url: "https://unsplash.com/photos/wdbXQaD6m_Y", alt: "Intérieur d'un PC avec carte graphique et watercooling" },
    "pc-purple":    { by: "Andre Tan", url: "https://unsplash.com/photos/8yesL5ZPjIU", alt: "PC gamer vitré avec ventilateurs lumineux" },
    "atelier-cpu":  { by: "JESHOOTS.COM", url: "https://unsplash.com/photos/DQBHliTwIaU", alt: "Main installant un processeur sur une carte mère" },
    "carte-mere":   { by: "Jason Leung", url: "https://unsplash.com/photos/8CWJa5fFJpk", alt: "Gros plan d'une carte mère" },
    "gpu-rtx":      { by: "Christian Wiediger", url: "https://unsplash.com/photos/TErYPw4o1KM", alt: "Carte graphique posée sur une table" },
    "peripheriques":{ by: "Sayan Majhi", url: "https://unsplash.com/photos/msvtLRzW8aY", alt: "Bureau avec clavier, souris et accessoires" },
    "serveurs":     { by: "imgix", url: "https://unsplash.com/photos/klWUhr-wPJ8", alt: "Baies de serveurs dans un centre de données" },
    "audio-studio": { by: "Caught In Joy", url: "https://unsplash.com/photos/ptVBlniJi50", alt: "Studio d'enregistrement avec console de mixage" },
    "archi-cad":    { by: "TECNIC Bioprocess Solutions", url: "https://unsplash.com/photos/SxaGgDQl2rU", alt: "Ingénieurs travaillant sur des plans à l'ordinateur" },
    "cyber-club":   { by: "Raman Shaunia", url: "https://unsplash.com/photos/l24i-13LtHo", alt: "Joueurs dans une salle de jeux en réseau" },
    "bureau-office":{ by: "Vitaly Gariev", url: "https://unsplash.com/photos/CXxH2EiX760", alt: "Open space avec des personnes au travail" }
  }
};
