export type Title = {
  id: string;
  title: string;
  year: number;
  runtime: number;
  rating: string;
  kind: "film" | "serie" | "live";
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  logo?: string;
  trending?: boolean;
  featured?: boolean;
  continueAt?: number;
  mood: "Calme" | "Tension" | "Cérébral" | "Lumineux" | "Sombre" | "Romance";
  tmdbId?: number;
  imdbId?: string;
  defaultSeason?: number;
  defaultEpisode?: number;
};

const poster = (p: string) => `https://image.tmdb.org/t/p/w780${p}`;
const backdrop = (p: string) => `https://image.tmdb.org/t/p/original${p}`;

export const titles: Title[] = [
  {
    id: "dune-part-two",
    title: "Dune : Deuxième Partie",
    year: 2024,
    runtime: 166,
    rating: "12+",
    kind: "film",
    genres: ["Science-fiction", "Aventure"],
    synopsis:
      "Paul Atréides s'allie aux Fremen pour mener une révolte contre ceux qui ont anéanti sa famille — et fait face à un choix entre l'amour et le destin de l'univers connu.",
    poster: poster("/1pdfLvkbY9ohJlCjQH2CZjjYujr.jpg"),
    backdrop: backdrop("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"),
    featured: true,
    trending: true,
    mood: "Tension",
    tmdbId: 693134,
    imdbId: "tt15239678",
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    year: 2016,
    runtime: 51,
    rating: "16+",
    kind: "serie",
    genres: ["Mystère", "Drame", "Fantastique"],
    synopsis:
      "À Hawkins, Indiana, la disparition d'un enfant révèle l'existence d'expérimentations secrètes, de forces surnaturelles et d'une petite fille pas comme les autres.",
    poster: poster("/49WJfeN0moxb9IPfGn8AIqMGskD.jpg"),
    backdrop: backdrop("/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"),
    trending: true,
    continueAt: 38,
    mood: "Sombre",
    tmdbId: 66732,
    imdbId: "tt4574334",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    year: 2023,
    runtime: 60,
    rating: "16+",
    kind: "serie",
    genres: ["Drame", "Post-apocalyptique"],
    synopsis:
      "Vingt ans après l'effondrement de la civilisation, Joel doit escorter Ellie — peut-être la dernière chance de l'humanité — à travers un continent dévasté.",
    poster: poster("/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg"),
    backdrop: backdrop("/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg"),
    trending: true,
    mood: "Sombre",
    tmdbId: 100088,
    imdbId: "tt3581920",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "wednesday",
    title: "Mercredi",
    year: 2022,
    runtime: 50,
    rating: "12+",
    kind: "serie",
    genres: ["Comédie noire", "Mystère"],
    synopsis:
      "Mercredi Addams enquête sur une vague de meurtres qui agite l'académie Nevermore, tout en maîtrisant ses pouvoirs naissants et son pire ennemi : tout le monde.",
    poster: poster("/9PFonBhy4cQy7Jz20NpMygczOkv.jpg"),
    backdrop: backdrop("/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg"),
    mood: "Cérébral",
    tmdbId: 119051,
    imdbId: "tt13443470",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    runtime: 180,
    rating: "16+",
    kind: "film",
    genres: ["Drame", "Biographique"],
    synopsis:
      "L'ascension fulgurante et la chute morale du physicien qui a dirigé le Projet Manhattan — et changé la nature même du pouvoir et de la guerre.",
    poster: poster("/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
    backdrop: backdrop("/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg"),
    trending: true,
    mood: "Cérébral",
    tmdbId: 872585,
    imdbId: "tt15398776",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    runtime: 169,
    rating: "TP",
    kind: "film",
    genres: ["Science-fiction", "Drame"],
    synopsis:
      "Une équipe d'explorateurs franchit un trou de ver pour découvrir si l'humanité a un avenir au-delà de la Terre — et ce que l'amour pèse dans la balance du cosmos.",
    poster: poster("/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"),
    backdrop: backdrop("/pbrkL804c8yAv3zBZR4QPEafpAR.jpg"),
    continueAt: 64,
    mood: "Cérébral",
    tmdbId: 157336,
    imdbId: "tt0816692",
  },
  {
    id: "house-of-the-dragon",
    title: "House of the Dragon",
    year: 2022,
    runtime: 60,
    rating: "16+",
    kind: "serie",
    genres: ["Fantastique", "Drame"],
    synopsis:
      "Deux siècles avant Game of Thrones, la maison Targaryen s'apprête à se déchirer dans une guerre civile dont l'enjeu est le Trône de Fer.",
    poster: poster("/z2yahl2uefxDCl0nogcRBstwruJ.jpg"),
    backdrop: backdrop("/etj8E2o4Bxx7LbBxAzbeKSF8Bdx.jpg"),
    mood: "Sombre",
    tmdbId: 94997,
    imdbId: "tt11198330",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    year: 2008,
    runtime: 49,
    rating: "16+",
    kind: "serie",
    genres: ["Drame", "Polar"],
    synopsis:
      "Un professeur de chimie atteint d'un cancer transforme sa rage en empire — et découvre l'homme qu'il a toujours été.",
    poster: poster("/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"),
    backdrop: backdrop("/tsRy63Mu5cu022Q9x4cMnLQXSAI.jpg"),
    mood: "Sombre",
    tmdbId: 1396,
    imdbId: "tt0903747",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "the-bear",
    title: "The Bear",
    year: 2022,
    runtime: 30,
    rating: "16+",
    kind: "serie",
    genres: ["Drame", "Cuisine"],
    synopsis:
      "Un chef étoilé hérite du sandwich shop familial à Chicago — et de tout ce qu'il pensait avoir fui.",
    poster: poster("/zPyHvEosD3KMmkx0bAzKx5j8GbS.jpg"),
    backdrop: backdrop("/uYg5HbWnzwMq0iexcCC7DyHpsx2.jpg"),
    trending: true,
    mood: "Tension",
    tmdbId: 136315,
    imdbId: "tt14452776",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "everything-everywhere",
    title: "Everything Everywhere All at Once",
    year: 2022,
    runtime: 139,
    rating: "12+",
    kind: "film",
    genres: ["Science-fiction", "Comédie"],
    synopsis:
      "Une blanchisseuse chinoise-américaine découvre qu'elle peut accéder à toutes les versions d'elle-même à travers le multivers — et qu'aucune ne va bien.",
    poster: poster("/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg"),
    backdrop: backdrop("/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg"),
    mood: "Lumineux",
    tmdbId: 545611,
    imdbId: "tt6710474",
  },
  {
    id: "succession",
    title: "Succession",
    year: 2018,
    runtime: 60,
    rating: "16+",
    kind: "serie",
    genres: ["Drame", "Satire"],
    synopsis:
      "Une famille richissime se déchire pour le contrôle de l'empire médiatique de leur père — et découvre qu'aucune fortune ne rachète l'amour qu'on n'a jamais reçu.",
    poster: poster("/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg"),
    backdrop: backdrop("/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg"),
    mood: "Cérébral",
    tmdbId: 76331,
    imdbId: "tt7660850",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "the-batman",
    title: "The Batman",
    year: 2022,
    runtime: 176,
    rating: "12+",
    kind: "film",
    genres: ["Action", "Polar"],
    synopsis:
      "Au cœur d'une Gotham détrempée, un Batman nouveau, jeune et vengeur traque un tueur en série qui s'attaque à l'élite corrompue de la ville.",
    poster: poster("/74xTEgt7R36Fpooo50r9T25onhq.jpg"),
    backdrop: backdrop("/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"),
    mood: "Sombre",
    tmdbId: 414906,
    imdbId: "tt1877830",
  },
  {
    id: "spider-verse",
    title: "Spider-Man : Across the Spider-Verse",
    year: 2023,
    runtime: 140,
    rating: "TP",
    kind: "film",
    genres: ["Animation", "Aventure"],
    synopsis:
      "Miles Morales saute à travers le multivers et rencontre une société secrète de Spider-héros — avant de comprendre qu'ils ne se battent pas pour les mêmes raisons.",
    poster: poster("/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"),
    backdrop: backdrop("/4HodYYKEIsGOdinkGi2Ucfxxam.jpg"),
    trending: true,
    mood: "Lumineux",
    tmdbId: 569094,
    imdbId: "tt9362722",
  },
  {
    id: "barbie",
    title: "Barbie",
    year: 2023,
    runtime: 114,
    rating: "TP",
    kind: "film",
    genres: ["Comédie", "Aventure"],
    synopsis:
      "Barbie quitte Barbie Land pour le monde réel et découvre que la perfection plastique n'a jamais protégé personne de la réalité.",
    poster: poster("/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"),
    backdrop: backdrop("/nHf61UzkfFno5X1ofIhugCPus2R.jpg"),
    mood: "Lumineux",
    tmdbId: 346698,
    imdbId: "tt1517268",
  },
  {
    id: "arcane",
    title: "Arcane",
    year: 2021,
    runtime: 40,
    rating: "12+",
    kind: "serie",
    genres: ["Animation", "Action"],
    synopsis:
      "Dans la ville utopique de Piltover et son sous-sol de Zaun, deux sœurs se retrouvent de part et d'autre d'une guerre que personne n'avait vraiment voulue.",
    poster: poster("/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg"),
    backdrop: backdrop("/8Z8dptJEypuLoOQro1WugD855YE.jpg"),
    mood: "Tension",
    tmdbId: 94605,
    imdbId: "tt11126994",
    defaultSeason: 1,
    defaultEpisode: 1,
  },
  {
    id: "anatomie-chute",
    title: "Anatomie d'une chute",
    year: 2023,
    runtime: 151,
    rating: "16+",
    kind: "film",
    genres: ["Drame", "Thriller judiciaire"],
    synopsis:
      "Une romancière est jugée pour la mort de son mari — et chaque témoignage transforme la vérité en une histoire de plus.",
    poster: poster("/kQs6keheMwCxJxrzV83VUwFtHkB.jpg"),
    backdrop: backdrop("/3agtMkw7CryBPmaybBgWGRtoENk.jpg"),
    mood: "Cérébral",
    tmdbId: 915935,
    imdbId: "tt17009710",
  },
];

export const liveNow: Title[] = [
  {
    id: "live-coupe-monde",
    title: "Finale — Coupe du Monde",
    year: 2026,
    runtime: 120,
    rating: "TP",
    kind: "live",
    genres: ["Sport", "Football"],
    synopsis: "Diffusion en direct depuis le Stade Vélodrome.",
    poster: poster("/74xTEgt7R36Fpooo50r9T25onhq.jpg"),
    backdrop: backdrop("/etj8E2o4Bxx7LbBxAzbeKSF8Bdx.jpg"),
    mood: "Tension",
  },
  {
    id: "live-jazz-night",
    title: "Blue Note — Jazz Night Sessions",
    year: 2026,
    runtime: 90,
    rating: "TP",
    kind: "live",
    genres: ["Musique", "Concert"],
    synopsis: "Sessions enregistrées en direct, chaque soir à 21h.",
    poster: poster("/zPyHvEosD3KMmkx0bAzKx5j8GbS.jpg"),
    backdrop: backdrop("/uYg5HbWnzwMq0iexcCC7DyHpsx2.jpg"),
    mood: "Calme",
  },
];

export function getTitle(id: string): Title | undefined {
  return [...titles, ...liveNow].find((t) => t.id === id);
}

export const rows = [
  { name: "Tendances cette semaine", filter: (t: Title) => !!t.trending },
  { name: "Continuer à regarder", filter: (t: Title) => !!t.continueAt },
  { name: "Cinéma de la décennie", filter: (t: Title) => t.kind === "film" },
  { name: "Séries qui obsèdent", filter: (t: Title) => t.kind === "serie" },
  { name: "Pour les nuits cérébrales", filter: (t: Title) => t.mood === "Cérébral" },
  { name: "Côté sombre", filter: (t: Title) => t.mood === "Sombre" },
  { name: "Quelque chose de lumineux", filter: (t: Title) => t.mood === "Lumineux" },
];

export const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
