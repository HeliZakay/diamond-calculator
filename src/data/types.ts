// ----------------------------------------------------
// Core diamond types
// ----------------------------------------------------

// Cut grade categories (based on GIA standard)
export type Cut = "Excellent" | "Very Good" | "Good" | "Fair";

// Color grade categories (D = colorless, J = faint yellow)
export type Color = "D" | "E" | "F" | "G" | "H" | "I" | "J";

// Clarity grade categories (FL = flawless, I1 = included)
export type Clarity =
  | "FL"
  | "IF"
  | "VVS1"
  | "VVS2"
  | "VS1"
  | "VS2"
  | "SI1"
  | "SI2"
  | "I1";

// Basic diamond input for price calculation
export interface DiamondInput {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
}

// Full diamond data (used in mock data)
export interface Diamond extends DiamondInput {
  id: number;
  img: string;
}
