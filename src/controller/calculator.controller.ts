import { Response } from "express";
import { AuthenticatedRequest } from "../types";

// helper
const getConditionMultiplier = (condition: string): number => {
  switch (condition) {
    case "new_with_tags":
      return 0.85;
    case "like_new":
      return 0.7;
    case "good":
      return 0.55;
    case "fair":
      return 0.35;
    case "worn":
      return 0.2;
    default:
      return 0.5;
  }
};

const getBrandMultiplier = (brand: string): number => {
  const premiumBrands = [
    "zara",
    "h&m",
    "nike",
    "adidas",
    "levi's",
    "levis",
    "puma",
    "uniqlo",
    "forever 21",
    "mango",
  ];

  const luxuryBrands = [
    "gucci",
    "prada",
    "armani",
    "versace",
    "balenciaga",
    "burberry",
  ];

  const brandLower = brand.toLowerCase();

  if (luxuryBrands.includes(brandLower)) return 1.5;
  if (premiumBrands.includes(brandLower)) return 1.2;

  return 1.0;
};

const getTypeBaseFactor = (clothingType: string): number => {
  switch (clothingType) {
    case "outerwear":
      return 1.25;
    case "shoes":
      return 1.15;
    case "formal":
      return 1.2;
    case "dresses":
      return 1.1;
    case "activewear":
      return 1.05;
    case "tops":
    case "bottoms":
    case "accessories":
    default:
      return 1.0;
  }
};

export const estimateClothingValue = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      clothing_type,
      brand,
      condition_status,
      original_price,
      age_in_months = 0,
    } = req.body;

    if (!clothing_type || !condition_status || !original_price) {
      res.status(400).json({
        message:
          "clothing_type, condition_status and original_price are required",
      });
      return;
    }

    const originalPrice = Number(original_price);
    const ageInMonths = Number(age_in_months);

    if (isNaN(originalPrice) || originalPrice <= 0) {
      res.status(400).json({
        message: "original_price must be a valid number greater than 0",
      });
      return;
    }

    if (isNaN(ageInMonths) || ageInMonths < 0) {
      res.status(400).json({
        message: "age_in_months must be a valid positive number",
      });
      return;
    }

    const conditionMultiplier = getConditionMultiplier(condition_status);
    const brandMultiplier = getBrandMultiplier(brand || "");
    const typeFactor = getTypeBaseFactor(clothing_type);

    // age depreciation
    let ageMultiplier = 1;
    if (ageInMonths <= 3) ageMultiplier = 0.95;
    else if (ageInMonths <= 6) ageMultiplier = 0.85;
    else if (ageInMonths <= 12) ageMultiplier = 0.7;
    else if (ageInMonths <= 24) ageMultiplier = 0.55;
    else ageMultiplier = 0.4;

    const estimatedValue =
      originalPrice *
      conditionMultiplier *
      brandMultiplier *
      typeFactor *
      ageMultiplier;

    const roundedValue = Math.max(50, Math.round(estimatedValue));

    let tradeSuggestion = "";
    if (roundedValue >= originalPrice * 0.75) {
      tradeSuggestion = "High value item — suitable for premium swaps";
    } else if (roundedValue >= originalPrice * 0.45) {
      tradeSuggestion = "Good swap value — fair exchange item";
    } else {
      tradeSuggestion = "Lower swap value — best for basic exchanges";
    }

    res.status(200).json({
      success: true,
      message: "Clothing value estimated successfully",
      data: {
        original_price: originalPrice,
        estimated_value: roundedValue,
        breakdown: {
          clothing_type,
          brand: brand || "Generic",
          condition_status,
          age_in_months: ageInMonths,
          condition_multiplier: conditionMultiplier,
          brand_multiplier: brandMultiplier,
          type_factor: typeFactor,
          age_multiplier: ageMultiplier,
        },
        trade_suggestion: tradeSuggestion,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: `Internal server error: ${errorMessage}`,
    });
  }
};
