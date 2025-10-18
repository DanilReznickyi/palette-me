// components/shop/mockData.ts
export type CanvasSize = "A4" | "A3" | "50x70" | "60x80";
export type Category = "nature" | "forest" | "city" | "animals" | "abstract" | "sea" | "mountains";

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;         // EUR
  rating: number;        // 0..5
  reviews: number;
  size: CanvasSize;
  categories: Category[];
  dateAdded: string;     // ISO
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "coastal-sunset",
    title: "Coastal Sunset",
    description: "Warm tones and smooth shapes for a relaxing evening paint.",
    price: 19,
    rating: 4.7,
    reviews: 126,
    size: "A3",
    categories: ["nature", "sea", "abstract"],
    dateAdded: "2025-09-10",
  },
  {
    id: "p2",
    slug: "misty-forest",
    title: "Misty Forest",
    description: "Soft gradients and layered pines for mindful painting.",
    price: 24,
    rating: 4.9,
    reviews: 312,
    size: "50x70",
    categories: ["nature", "forest", "mountains"],
    dateAdded: "2025-09-18",
  },
  {
    id: "p3",
    slug: "city-lights",
    title: "City Lights",
    description: "Neon reflections and bold shapes for an urban vibe.",
    price: 29,
    rating: 4.5,
    reviews: 78,
    size: "A4",
    categories: ["city", "abstract"],
    dateAdded: "2025-09-22",
  },
  {
    id: "p4",
    slug: "golden-meadow",
    title: "Golden Meadow",
    description: "Gentle fields and bright sky. Simple and joyful.",
    price: 15,
    rating: 4.2,
    reviews: 41,
    size: "A4",
    categories: ["nature"],
    dateAdded: "2025-08-29",
  },
  {
    id: "p5",
    slug: "alpine-lake",
    title: "Alpine Lake",
    description: "Crisp edges and cool palette of a mountain lake.",
    price: 34,
    rating: 4.8,
    reviews: 203,
    size: "60x80",
    categories: ["mountains", "nature", "sea"],
    dateAdded: "2025-09-05",
  },
  {
    id: "p6",
    slug: "tiger-gaze",
    title: "Tiger Gaze",
    description: "Contrasty areas and clear numbering for animal lovers.",
    price: 27,
    rating: 4.6,
    reviews: 155,
    size: "A3",
    categories: ["animals", "abstract"],
    dateAdded: "2025-09-12",
  },
];

export function makePlaceholder(title: string, seed = 0) {
  // Генерируем мягкий градиент + подпись, чтобы выглядело как “обложка”
  const hue = (seed * 47) % 360;
  const hue2 = (hue + 35) % 360;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='1000' height='700'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='hsl(${hue},70%,65%)'/>
        <stop offset='100%' stop-color='hsl(${hue2},70%,55%)'/>
      </linearGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend mode="multiply"/>
      </filter>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <g opacity="0.12" filter="url(#grain)"><rect width="100%" height="100%" fill="#000"/></g>
    <g font-family='Inter, system-ui' fill='white'>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-size='56' font-weight='800' opacity='0.95'>${title}</text>
      <text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle'
            font-size='22' opacity='0.9'>paint-by-numbers</text>
    </g>
    <rect x='24' y='24' width='952' height='652' rx='28' ry='28'
          fill='none' stroke='rgba(255,255,255,.65)' stroke-width='4'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
