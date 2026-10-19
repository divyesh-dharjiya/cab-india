export const CABS = [
  { id: "micro", name: "Micro", description: "Compact & pocket friendly", seats: 3, baseFare: 40, perKm: 12, minFare: 80, color: "#F59E0B" },
  { id: "hatchback", name: "Hatchback", description: "Everyday comfortable rides", seats: 4, baseFare: 50, perKm: 13, minFare: 100, color: "#10B981" },
  { id: "sedan", name: "Sedan", description: "Extra legroom & boot space", seats: 4, baseFare: 60, perKm: 15, minFare: 120, color: "#3B82F6" },
  { id: "suv", name: "SUV", description: "Spacious rides for groups", seats: 6, baseFare: 80, perKm: 17.5, minFare: 160, color: "#8B5CF6" },
  { id: "mpv", name: "MPV", description: "Room for family & luggage", seats: 7, baseFare: 100, perKm: 20, minFare: 200, color: "#EF4444" },
];

export const estimateFare = (cab, metres) =>
  Math.max(cab.minFare, cab.baseFare + cab.perKm * (metres / 1000));
