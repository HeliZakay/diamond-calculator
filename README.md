# Diamond Price Calculator

A responsive and polished **React** application that calculates the price of a diamond based on its **Carat**, **Cut**, **Color**, and **Clarity**—and displays similar (or recommended) diamonds with images and prices.

This project fulfills and extends the requirements from the **Worthy Frontend Exercise**, demonstrating both algorithmic implementation and UX/UI quality suitable for an investor-facing pricing tool.

---

## 🎯 Live Demo

➡️ https://diamond-calculator-rho.vercel.app/

---

## 📝 Features

### Core Requirements (✅ Fully Implemented)

- User inputs **Carat**, **Cut**, **Color**, and **Clarity**
- Final price is calculated **instantly**
- A popup lists **similar diamonds** (photo + price)
- Fully responsive and visually polished for both **desktop and mobile**

### Extra Features & Improvements (🌟 Advantage Points)

| Feature                             | Description                                                              |
| ----------------------------------- | ------------------------------------------------------------------------ |
| **Hero Section**                    | Strong first impression and visual framing of the feature.               |
| **Sparkle Cursor Effect**           | A playful interactive UI flourish enhancing luxury product feel.         |
| **Price Breakdown Popup**           | Users can view how the final price was calculated factor-by-factor.      |
| **Dynamic Diamond Preview**         | Visual diamond representation updates based on user selections.          |
| **Instant Price Updates**           | No "Submit" button required — reacts to input in real-time.              |
| **Intelligent Similar Items Logic** | If no similar matches exist, recommended alternatives are shown instead. |
| **Scalable Code Architecture**      | Feature-based folder structure, shared UI components, util helpers.      |
| **Built with React**                | Modern component patterns and state management best practices.           |

---

## 💎 Price Calculation & Assumptions

The final diamond price is based on a simple, scalable factor model:

1. We start with a **base price per 1 Carat**.
2. This base is **multiplied by the selected Carat weight**.
3. Each quality attribute — **Cut**, **Color**, and **Clarity** — has its own **weighting factor**.
4. These factors are then **multiplied into the price**, increasing or decreasing it depending on the characteristics chosen.

In short:

> **Final Price = (Base Price × Carat) × CutFactor × ColorFactor × ClarityFactor**

The factor constants are defined in one place, making the pricing model easy to adjust or extend.

---
