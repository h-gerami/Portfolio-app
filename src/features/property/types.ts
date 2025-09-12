export type Property = {
  id: string;
  title: string;
  address: string;
  image: string;
  priceGuide: string;
  lastSoldPrice?: string;
  bed: number;
  bath: number;
  car: number;
  priceHistory: number[];
  auctionResults: string;
  rentalYield: string;
  agentVariance: string;
};
