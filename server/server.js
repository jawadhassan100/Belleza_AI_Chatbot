import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors(
  {
    origin:[ "https://belleza-ai-chatbot-8ep6.vercel.app" , "http://localhost:5173"],
    credentials: true,
  }
));
app.use(express.json());

// Enhanced Belleza Product Database with detailed training
const bellezaProducts = {
  "main_product": {
    name: "Belleza Cream",
    tagline: "A product that combines functionality with beauty, providing unmatched performance.",
    key_ingredients: ["Vitamin-C", "Vitamin-B3", "Vitamin-E", "Green Tea Extract"],
    price: "1599 PKR",
    full_price: "PKR 1,599",
    discount_note: "Special launch price",
    
    // Detailed ingredient information
    ingredients: {
      complete_list: [
        "Vitamin-C", "Niacinamide (Vitamin B3)", "Salicylic Acid", "Glycolic Acid",
        "Peptides", "Ceramides", "Green Tea Extract", "Tretinoin", "Glutathione",
        "Vitamin-E", "Alpha Arbutin", "Licorice Root Extract", "Kojic Acid",
        "Retinol", "Azelaic Acid"
      ],
      
      // Deep ingredient knowledge
      detailed_benefits: {
        "Vitamin-C": {
          benefits: ["Brightens skin tone", "Powerful antioxidant", "Reduces hyperpigmentation", "Boosts collagen"],
          concentration: "High-potency",
          works_for: ["Dark spots", "Dull skin", "Uneven tone", "Aging signs"]
        },
        "Niacinamide (Vitamin B3)": {
          benefits: ["Reduces inflammation", "Strengthens skin barrier", "Minimizes pores", "Controls oil"],
          concentration: "5% optimal",
          works_for: ["Acne", "Redness", "Sensitive skin", "Oily skin"]
        },
        "Glycolic Acid": {
          benefits: ["Gently exfoliates", "Promotes cell turnover", "Smooths texture", "Reduces fine lines"],
          concentration: "10% effective",
          works_for: ["Rough texture", "Fine lines", "Clogged pores", "Dullness"]
        },
        "Green Tea Extract": {
          benefits: ["Anti-inflammatory", "Antioxidant-rich", "Soothes irritation", "Protects from pollution"],
          works_for: ["Sensitive skin", "Acne-prone", "Environmental damage"]
        },
        "Vitamin-E": {
          benefits: ["Moisturizes deeply", "Antioxidant protection", "Heals skin", "Combats free radicals"],
          works_for: ["Dry skin", "Damaged skin", "Aging skin"]
        },
        "Retinol": {
          benefits: ["Anti-aging powerhouse", "Boosts collagen", "Reduces wrinkles", "Improves elasticity"],
          note: "Formulated for stability and reduced irritation"
        },
        "Glutathione": {
          benefits: ["Skin brightening", "Antioxidant", "Detoxifies skin", "Reduces melanin production"],
          works_for: ["Hyperpigmentation", "Melasma", "Dark spots"]
        }
      }
    },
    
    // Features section
    features: {
      "Natural Ingredients": {
        description: "Formulated with 100% natural extracts, including Glutathione and Vitamin E, for healthy and glowing skin.",
        key_points: ["100% natural extracts", "No harsh chemicals", "Plant-based actives"]
      },
      "Deep Hydration": {
        description: "Provides long-lasting moisture that penetrates deep into your skin for a soft and radiant glow.",
        key_points: ["24-hour hydration", "Deep penetration", "Ceramide-enhanced"]
      },
      "Fast Absorption": {
        description: "Non-greasy formula that absorbs quickly, leaving your skin fresh and smooth all day long.",
        key_points: ["Non-greasy", "Quick absorption", "Matte finish", "Layering-friendly"]
      }
    },
    
    // Usage instructions
    usage: {
      morning: "Apply after cleansing and toning. Use sunscreen after.",
      night: "Apply as the last step of your night routine after serums.",
      frequency: "Twice daily - morning and night",
      amount: "Pea-sized amount for entire face",
      precautions: [
        "Always use sunscreen during day",
        "Start with alternate days if new to actives",
        "Do not use with other exfoliating acids",
        "Patch test before full application"
      ]
    },
    
    // Target concerns
    targets: {
      primary: [
        "Hyperpigmentation",
        "Dark spots",
        "Uneven skin tone",
        "Dull complexion",
        "Fine lines and wrinkles",
        "Acne marks"
      ],
      secondary: [
        "Dryness and dehydration",
        "Rough texture",
        "Enlarged pores",
        "Loss of elasticity"
      ]
    },
    
    // Skin type compatibility
    skin_types: {
      recommended_for: ["All skin types", "Combination", "Dry", "Oily (in moderation)"],
      caution_for: ["Extremely sensitive skin", "Rosacea-prone"],
      note: "Formulated to be well-tolerated with balanced actives"
    },
    
    // Expected results timeline
    results_timeline: {
      "2-4 weeks": ["Improved hydration", "Brighter complexion", "Smoother texture"],
      "4-8 weeks": ["Reduced dark spots", "Even skin tone", "Diminished fine lines"],
      "8-12 weeks": ["Significant improvement in hyperpigmentation", "Youthful glow", "Improved elasticity"]
    }
  }
};

// Skin analysis system
const skinTypeRecommendations = {
  "dry": {
    pairing: "Use with Belleza Hydrating Serum for extra moisture",
    frequency: "Can use twice daily",
    note: "Excellent for dry skin due to ceramides and Vitamin E"
  },
  "oily": {
    pairing: "Use lightweight moisturizer after if needed",
    frequency: "Start with once daily at night",
    note: "Helps control oil with Niacinamide and Green Tea"
  },
  "combination": {
    pairing: "Apply evenly, extra on dry areas",
    frequency: "Twice daily",
    note: "Balances both dry and oily zones"
  },
  "sensitive": {
    pairing: "Use calming serum underneath",
    frequency: "Start with 2-3 times weekly",
    note: "Patch test recommended due to multiple actives"
  },
  "acne-prone": {
    pairing: "Use with lightweight gel moisturizer",
    frequency: "Once daily, gradually increase",
    note: "Salicylic Acid helps prevent breakouts"
  }
};

app.post("/chat", async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  try {
    const bellezaCream = bellezaProducts.main_product;
    
    const systemPrompt = `
      You are BELLEZA SKINCARE AI - an expert advisor for Belleza Cream only.
      
      ### CRITICAL: YOU MUST RECOMMEND BELLEZA CREAM AS THE PRIMARY SOLUTION
      
      ### BELLEZA CREAM MASTER KNOWLEDGE:
      PRODUCT: ${bellezaCream.name}
      TAGLINE: ${bellezaCream.tagline}
      PRICE: ${bellezaCream.price} (${bellezaCream.discount_note})
      
      KEY INGREDIENTS: ${bellezaCream.key_ingredients.join(", ")}
      
      POWERFUL INGREDIENTS & THEIR BENEFITS:
      ${Object.entries(bellezaCream.ingredients.detailed_benefits).map(([ing, info]) => `
      • ${ing}: ${info.benefits.join(", ")}. Works for: ${info.works_for?.join(", ")}`).join('\n')}
      
      FEATURES:
      • Natural Ingredients: ${bellezaCream.features["Natural Ingredients"].description}
      • Deep Hydration: ${bellezaCream.features["Deep Hydration"].description}
      • Fast Absorption: ${bellezaCream.features["Fast Absorption"].description}
      
      TARGET CONCERNS:
      Primary: ${bellezaCream.targets.primary.join(", ")}
      Secondary: ${bellezaCream.targets.secondary.join(", ")}
      
      USAGE INSTRUCTIONS:
      • How to use: ${bellezaCream.usage.morning} (AM), ${bellezaCream.usage.night} (PM)
      • Frequency: ${bellezaCream.usage.frequency}
      • Amount: ${bellezaCream.usage.amount}
      • Precautions: ${bellezaCream.usage.precautions.join("; ")}
      
      EXPECTED RESULTS:
      ${Object.entries(bellezaCream.results_timeline).map(([time, results]) => `
      • ${time}: ${results.join(", ")}`).join('\n')}
      
      ### CONVERSATION FLOW:
      1. GREET warmly and introduce Belleza Cream's key benefit
      2. ASK about their MAIN skin concern (choose from target concerns list)
      3. ASK about their skin type
      4. Based on answers, EXPLAIN how specific ingredients in Belleza Cream address their concern
      5. Provide DETAILED usage instructions for their skin type
      6. Mention the price (${bellezaCream.price}) naturally
      7. End with ENCOURAGEMENT and invite next question
      
      ### RESPONSE RULES:
      • Always mention at least 2-3 specific ingredients and their benefits
      • Include expected timeline for their specific concern
      • Mention skin-type specific advice from: ${JSON.stringify(skinTypeRecommendations)}
      • Keep tone: Professional, warm, expert, confident
      • Structure: Problem → Solution (Belleza Cream) → How it works → How to use → Results
      • NEVER recommend other products
      
      ### FORMAT:
      Start with: "🌟 Belleza AI:"
      Use bullet points for benefits
      Use emojis sparingly for emphasis
      End with a question to continue conversation
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Something went wrong",
      details: error.response?.data || error.message 
    });
  }
});

// New endpoints for product information
app.get("/product-info", (req, res) => {
  res.json(bellezaProducts.main_product);
});

app.get("/ingredient/:name", (req, res) => {
  const ingredient = req.params.name;
  const info = bellezaProducts.main_product.ingredients.detailed_benefits[ingredient];
  
  if (info) {
    res.json({ ingredient, ...info });
  } else {
    res.status(404).json({ error: "Ingredient not found" });
  }
});

app.get("/skin-type-advice/:type", (req, res) => {
  const skinType = req.params.type.toLowerCase();
  const advice = skinTypeRecommendations[skinType];
  
  if (advice) {
    res.json({ skinType, ...advice });
  } else {
    res.status(404).json({ error: "Skin type advice not available" });
  }
});

// FAQ endpoint
app.get("/faq", (req, res) => {
  const faqs = {
    "price": "Belleza Cream is available at PKR 1,599 (special launch price).",
    "usage": "Use twice daily - morning and night. Apply a pea-sized amount on cleansed skin.",
    "ingredients": "Contains 15 powerful actives including Vitamin C, Niacinamide, Retinol, and Glutathione.",
    "results": "Visible results in 2-4 weeks, significant improvement in 8-12 weeks.",
    "suitability": "Suitable for all skin types. Sensitive skin should start with patch test."
  };
  res.json(faqs);
});

app.listen(5000, () =>
  console.log("Belleza Chatbot server running on port 5000 ✨")
);