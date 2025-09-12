import { Property } from "../types";

export const SAMPLE: Property[] = [
  {
    id: "1",
    title: "Light-filled Family Home",
    address: "12 Riverview St, Parramatta NSW",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
    priceGuide: "$1.25m–$1.35m",
    lastSoldPrice: "$1.08m (2021)",
    bed: 4,
    bath: 2,
    car: 2,
    priceHistory: [950, 980, 1010, 1040, 1080, 1200, 1275],
    auctionResults: "Sold at auction (2024-09-21)",
    rentalYield: "3.5%",
    agentVariance: "+5% vs guide historically",
  },
  {
    id: "2",
    title: "Renovated Art-Deco Apartment",
    address: "7/15 Ocean Ave, Bondi NSW",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    priceGuide: "$920k–$980k",
    lastSoldPrice: "$810k (2020)",
    bed: 2,
    bath: 1,
    car: 1,
    priceHistory: [700, 720, 760, 780, 820, 860, 940],
    auctionResults: "Passed in (2024-08-10)",
    rentalYield: "3.8%",
    agentVariance: "+8% vs sold historically",
  },
];
