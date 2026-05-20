export { GitHubExportFunctions } from "./github-export";
import { Function, Integer } from "@foundry/functions-api";
import { Objects, FoodGenieImages, FoodGenieRoommates, FoodGenieRoommatesBio, FoodGenieTimeTable } from "@foundry/ontology-api";
import { GPT_4o } from "@foundry/models-api/language-models";

/**
 * FoodGenie AIP Logic Functions - TypeScript Implementation
 * =========================================================
 * This repository contains TypeScript equivalents of the FoodGenie AIP Logic functions.
 * These can be used directly in Foundry OR exported to GitHub for external use.
 *
 * Functions:
 * 1. foodGenieImageClassifier - Identifies food from image descriptions
 * 2. foodGenieChat - Conversational AI chef with context awareness
 * 3. foodGenieIngredientsInfo - Nutrition, storage tips, substitutions
 * 4. foodGenieRecipeSuggestions - Personalized recipe generation
 */
export class FoodGenieFunctions {

    // 1. FOOD IMAGE CLASSIFIER

    /**
     * Identifies a food item from an image description or visual input.
     * Replicates: FoodGenieImageClassifier AIP Logic
     *
     * @param imageDescription - Description or context about the food image
     * @returns The identified food name
     */
    @Function()
    public async foodGenieImageClassifier(imageDescription: string): Promise<string> {
        const systemPrompt = `You are a food identification expert. Given an image of a food item, identify the exact food (e.g., 'red apple', 'green peas', 'chicken breast'). If you don't know the food item give output as - 'I am not sure'. Don't mention the company name just mention the product (don't explain the product).`;

        const response = await GPT_4o.createChatCompletion({
            params: { temperature: 0, maxTokens: 100 },
            messages: [
                { role: "SYSTEM", contents: [{ text: systemPrompt }] },
                { role: "USER", contents: [{ text: imageDescription }] },
            ],
        });

        return response.choices[0]?.message?.content ?? "I am not sure";
    }

    // 2. FOOD GENIE CHAT

    /**
     * Conversational AI chef that answers cooking questions with full context awareness.
     * Replicates: FoodGenieChat AIP Logic
     *
     * @param userMessage - The user's cooking question or message
     * @param userId - The roommate's user ID (to fetch their dietary rules)
     * @returns AI-generated cooking advice personalized to the user
     */
    @Function()
    public async foodGenieChat(userMessage: string, userId: string): Promise<string> {
        const bioRules = await Objects.search().foodGenieRoommatesBio()
            .filter(bio => bio.userId.exactMatch(userId))
            .allAsync();

        const rulesText = bioRules.length > 0
            ? bioRules.map(r => r.rules).filter(Boolean).join("\n- ")
            : "No dietary rules specified";

        const inventory = await Objects.search().foodGenieImages().allAsync();
        const inventoryText = inventory
            .map(item => item.food)
            .filter(Boolean)
            .join(", ");

        const systemPrompt = `You are FoodGenie, a friendly and knowledgeable AI cooking assistant. You help users with cooking questions, meal planning, and food-related queries. You are aware of the user's dietary restrictions, allergies, and food preferences. You also know what ingredients are currently available in their shared kitchen inventory. Always respect the user's dietary rules and suggest alternatives when needed. Be concise, helpful, and encouraging.

USER'S DIETARY RULES:
- ${rulesText}

CURRENT KITCHEN INVENTORY:
${inventoryText || "No items currently in inventory"}`;

        const response = await GPT_4o.createChatCompletion({
            params: { temperature: 0.7, maxTokens: 1500 },
            messages: [
                { role: "SYSTEM", contents: [{ text: systemPrompt }] },
                { role: "USER", contents: [{ text: userMessage }] },
            ],
        });

        return response.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";
    }

    // 3. INGREDIENTS INFO

    /**
     * Provides detailed nutrition info, storage tips, and substitution suggestions.
     * Replicates: FoodGenieIngredientsInfo AIP Logic
     *
     * @param ingredientName - The name of the ingredient to get info about
     * @returns Detailed ingredient information (nutrition, storage, substitutions)
     */
    @Function()
    public async foodGenieIngredientsInfo(ingredientName: string): Promise<string> {
        const systemPrompt = `You are a nutrition and food science expert. Given a food ingredient, provide:
1. **Nutritional Information**: Key macros and micronutrients per 100g serving.
2. **Storage Tips**: How to properly store the ingredient to maximize freshness.
3. **Substitutions**: Common substitutes for this ingredient in cooking.
4. **Fun Fact**: An interesting fact about this ingredient.
Format your response clearly with headers for each section.`;

        const response = await GPT_4o.createChatCompletion({
            params: { temperature: 0.5, maxTokens: 1500 },
            messages: [
                { role: "SYSTEM", contents: [{ text: systemPrompt }] },
                { role: "USER", contents: [{ text: `Tell me about: ${ingredientName}` }] },
            ],
        });

        return response.choices[0]?.message?.content ?? "Unable to fetch ingredient information.";
    }

    // 4. RECIPE SUGGESTIONS

    /**
     * Generates personalized recipe suggestions based on user preferences,
     * available inventory, and meal history.
     * Replicates: FoodGenieRecipeSuggestions AIP Logic
     *
     * @param userId - The roommate's user ID
     * @param mealType - Type of meal (Breakfast, Lunch, Dinner, Snacks, Dessert)
     * @param cravings - Optional specific cravings or preferences for this meal
     * @returns A detailed personalized recipe
     */
    @Function()
    public async foodGenieRecipeSuggestions(
        userId: string,
        mealType: string,
        cravings: string | undefined
    ): Promise<string> {
        const bioRules = await Objects.search().foodGenieRoommatesBio()
            .filter(bio => bio.userId.exactMatch(userId))
            .allAsync();

        const rulesText = bioRules.length > 0
            ? bioRules.map(r => r.rules).filter(Boolean).join("\n- ")
            : "No dietary rules specified";

        const inventory = await Objects.search().foodGenieImages().allAsync();
        const inventoryText = inventory
            .map(item => item.food)
            .filter(Boolean)
            .join(", ");

        const recentMeals = await Objects.search().foodGenieTimeTable()
            .filter(meal => meal.userId.exactMatch(userId))
            .allAsync();

        const recentMealsText = recentMeals.length > 0
            ? recentMeals.map(m => `${m.food} (${m.mealType})`).filter(Boolean).join(", ")
            : "No recent meals recorded";

        const user = await Objects.search().foodGenieRoommates()
            .filter(r => r.userId.exactMatch(userId))
            .allAsync();
        const userName = user.length > 0 ? user[0].userName : "User";

        const systemPrompt = `You are a world-class personal chef specializing in creating personalized recipes. Given a user's dietary rules, available kitchen inventory, past meals (to avoid repetition), meal type, and any specific cravings, generate a detailed recipe that:
1. Respects ALL dietary restrictions and allergies
2. Uses primarily ingredients available in the inventory
3. Avoids repeating meals eaten recently (within 3 days)
4. Matches the requested meal type
5. Incorporates cravings if specified

Format the recipe with: Recipe Name, Prep Time, Cook Time, Servings, Ingredients (with quantities), and Step-by-step Instructions.`;

        const userPrompt = `Generate a ${mealType} recipe for ${userName}.

DIETARY RULES:
- ${rulesText}

AVAILABLE KITCHEN INVENTORY:
${inventoryText || "No specific inventory available - suggest common ingredients"}

RECENT MEALS (avoid repeating):
${recentMealsText}

${cravings ? `SPECIFIC CRAVINGS: ${cravings}` : "No specific cravings - surprise me with something delicious!"}`;

        const response = await GPT_4o.createChatCompletion({
            params: { temperature: 0.8, maxTokens: 2000 },
            messages: [
                { role: "SYSTEM", contents: [{ text: systemPrompt }] },
                { role: "USER", contents: [{ text: userPrompt }] },
            ],
        });

        return response.choices[0]?.message?.content ?? "Unable to generate recipe. Please try again.";
    }
}
