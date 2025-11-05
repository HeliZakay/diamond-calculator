import type { Diamond } from "./types";

export const MOCK_DIAMONDS: Diamond[] = [
  {
    id: 1,
    carat: 1.9,
    cut: "Excellent",
    color: "D",
    clarity: "IF",
    img: "/diam1.png", // flawless, colorless, premium diamond
  },
  {
    id: 2,
    carat: 1.2,
    cut: "Very Good",
    color: "E",
    clarity: "VS2",
    img: "/diam2.png", // near-colorless, very slightly included
  },
  {
    id: 3,
    carat: 0.85,
    cut: "Good",
    color: "G",
    clarity: "SI1",
    img: "/diam3.png", // faint yellow tint, slightly included
  },
  {
    id: 4,
    carat: 1.4,
    cut: "Fair",
    color: "I",
    clarity: "SI2",
    img: "/diam4.png", // lower clarity, visible inclusions, warm tone
  },
  {
    id: 5,
    carat: 2.1,
    cut: "Excellent",
    color: "F",
    clarity: "VVS1",
    img: "/diam5.png", // near-flawless large diamond, icy white
  },
  {
    id: 6,
    carat: 0.75,
    cut: "Very Good",
    color: "H",
    clarity: "VS1",
    img: "/diam6.png", // balanced choice, slight warmth, clean look
  },
  {
    id: 7,
    carat: 1.8,
    cut: "Excellent",
    color: "D",
    clarity: "VVS2",
    img: "/diam7.png", // elegant white diamond, superior cut
  },
  {
    id: 8,
    carat: 1.0,
    cut: "Good",
    color: "J",
    clarity: "SI2",
    img: "/diam8.png", // affordable, light tint, visible inclusions
  },
  {
    id: 9,
    carat: 2.3,
    cut: "Very Good",
    color: "E",
    clarity: "VS1",
    img: "/diam9.png", // impressive size with great clarity
  },
  {
    id: 10,
    carat: 0.6,
    cut: "Fair",
    color: "E",
    clarity: "I1",
    img: "/diam10.png", // budget diamond, warm hue, visible inclusions
  },
];
