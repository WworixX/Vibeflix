export type Title = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  rating: string;
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  trending?: boolean;
  featured?: boolean;
  mood: "Cozy" | "Adrenaline" | "Cerebral" | "Romantic" | "Dark" | "Uplifting";
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const titles: Title[] = [
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    year: 2025,
    runtime: 128,
    rating: "TV-MA",
    genres: ["Sci-Fi", "Thriller"],
    synopsis:
      "Dans une métropole où les souvenirs s'achètent au marché noir, une archiviste découvre qu'elle est elle-même un faux.",
    poster: u("photo-1518709268805-4e9042af2176"),
    backdrop: u("photo-1542273917363-3b1817f69a2d"),
    featured: true,
    trending: true,
    mood: "Cerebral",
  },
  {
    id: "midnight-bloom",
    title: "Midnight Bloom",
    year: 2024,
    runtime: 102,
    rating: "PG-13",
    genres: ["Romance", "Drame"],
    synopsis:
      "Deux inconnus se croisent chaque nuit dans le dernier café ouvert de Lisbonne. Jusqu'à ce qu'un matin, l'un d'eux ne revienne pas.",
    poster: u("photo-1485846234645-a62644f84728"),
    backdrop: u("photo-1502136969935-8d8eef54d77b"),
    trending: true,
    mood: "Romantic",
  },
  {
    id: "iron-tide",
    title: "Iron Tide",
    year: 2025,
    runtime: 144,
    rating: "R",
    genres: ["Action", "Aventure"],
    synopsis:
      "Une capitaine de cargo affronte une tempête électromagnétique qui ramène à la surface ce que l'océan avait promis de garder.",
    poster: u("photo-1574375927938-d5a98e8ffe85"),
    backdrop: u("photo-1500964757637-c85e8a162699"),
    trending: true,
    mood: "Adrenaline",
  },
  {
    id: "soft-static",
    title: "Soft Static",
    year: 2023,
    runtime: 96,
    rating: "TV-14",
    genres: ["Comédie", "Slice of Life"],
    synopsis:
      "Quatre colocataires lancent une radio pirate depuis leur grenier et finissent par y enregistrer la bande-son d'un été.",
    poster: u("photo-1489599849927-2ee91cede3ba"),
    backdrop: u("photo-1517604931442-7e0c8ed2963c"),
    mood: "Cozy",
  },
  {
    id: "the-glass-forest",
    title: "The Glass Forest",
    year: 2024,
    runtime: 117,
    rating: "PG-13",
    genres: ["Fantastique", "Aventure"],
    synopsis:
      "Une cartographe perd son chemin dans une forêt qui se redessine chaque nuit.",
    poster: u("photo-1518562180175-34a163b1a9a6"),
    backdrop: u("photo-1502082553048-f009c37129b9"),
    mood: "Cerebral",
  },
  {
    id: "lowtown",
    title: "Lowtown",
    year: 2022,
    runtime: 134,
    rating: "TV-MA",
    genres: ["Polar", "Drame"],
    synopsis:
      "Trois ans après un braquage raté, l'argent refait surface — et avec lui, les fantômes qu'il avait achetés.",
    poster: u("photo-1485095329183-d0797cdc5676"),
    backdrop: u("photo-1485095329183-d0797cdc5676"),
    mood: "Dark",
  },
  {
    id: "ember-line",
    title: "Ember Line",
    year: 2025,
    runtime: 110,
    rating: "PG-13",
    genres: ["Drame", "Musique"],
    synopsis:
      "Une jeune compositrice hérite du carnet de notes inachevé de sa grand-mère, ancienne diva oubliée.",
    poster: u("photo-1514525253161-7a46d19cd819"),
    backdrop: u("photo-1465847899084-d164df4dedc6"),
    mood: "Uplifting",
  },
  {
    id: "echo-bay",
    title: "Echo Bay",
    year: 2023,
    runtime: 121,
    rating: "TV-14",
    genres: ["Mystère", "Drame"],
    synopsis:
      "Dans un village côtier, tous les habitants entendent la même voix au lever du soleil. Sauf une.",
    poster: u("photo-1500099817043-86d46000d58f"),
    backdrop: u("photo-1500099817043-86d46000d58f"),
    mood: "Cerebral",
  },
  {
    id: "pulse-protocol",
    title: "Pulse Protocol",
    year: 2024,
    runtime: 138,
    rating: "R",
    genres: ["Action", "Sci-Fi"],
    synopsis:
      "Une hackeuse infiltre un satellite militaire qui n'aurait jamais dû exister.",
    poster: u("photo-1542204165-65bf26472b9b"),
    backdrop: u("photo-1451187580459-43490279c0fa"),
    mood: "Adrenaline",
  },
  {
    id: "soft-rebellion",
    title: "Soft Rebellion",
    year: 2025,
    runtime: 94,
    rating: "PG-13",
    genres: ["Romance", "Comédie"],
    synopsis:
      "Elle écrit des slogans publicitaires. Il vit dans une cabane sans wifi. Ils signent un faux mariage de six mois.",
    poster: u("photo-1531299204812-e6d44d9a185c"),
    backdrop: u("photo-1496564203457-11bb12075d90"),
    mood: "Romantic",
  },
  {
    id: "after-static",
    title: "After Static",
    year: 2022,
    runtime: 108,
    rating: "TV-MA",
    genres: ["Horreur", "Thriller"],
    synopsis:
      "Une présentatrice télé reçoit chaque soir, à 3h33, un message qui n'a pas encore été tourné.",
    poster: u("photo-1478720568477-152d9b164e26"),
    backdrop: u("photo-1478720568477-152d9b164e26"),
    mood: "Dark",
  },
  {
    id: "honeyflood",
    title: "Honeyflood",
    year: 2024,
    runtime: 119,
    rating: "TV-14",
    genres: ["Drame", "Coming of Age"],
    synopsis:
      "Trois sœurs reviennent dans la ferme familiale pour vider la maison de leur mère et finissent par la remplir d'autre chose.",
    poster: u("photo-1500382017468-9049fed747ef"),
    backdrop: u("photo-1500382017468-9049fed747ef"),
    mood: "Uplifting",
  },
];

export function getTitle(id: string) {
  return titles.find((t) => t.id === id);
}

export const rows: { name: string; filter: (t: Title) => boolean }[] = [
  { name: "Tendances cette semaine", filter: (t) => !!t.trending },
  { name: "Adrénaline pure", filter: (t) => t.mood === "Adrenaline" },
  { name: "Pour les nuits cérébrales", filter: (t) => t.mood === "Cerebral" },
  { name: "Romance & frissons doux", filter: (t) => t.mood === "Romantic" },
  { name: "À regarder lové sous un plaid", filter: (t) => t.mood === "Cozy" || t.mood === "Uplifting" },
  { name: "Pour le côté obscur", filter: (t) => t.mood === "Dark" },
];

export const moods = ["Cozy", "Adrenaline", "Cerebral", "Romantic", "Dark", "Uplifting"] as const;
