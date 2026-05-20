# FoodGenie AIP

An AI-powered shared kitchen management application built on **Palantir Foundry**, helping roommates manage kitchen inventory, plan meals, generate personalized recipes, and get cooking assistance while respecting individual dietary preferences.

## Demo

[![FoodGenie Demo](https://img.youtube.com/vi/Cj1Rm57at04/0.jpg)](https://youtu.be/Cj1Rm57at04)

---

## Architecture Overview

```
Camera Upload → Media Set → LLM Classifier → Inventory Object Type
                                                      ↓
Roommates + Bio Rules + Timetable ← Ontology → AIP Logic Functions
                                                      ↓
                              OSDK React App ← Functions → Workshop App
```

### Components

| Component | Directory | Description |
|-----------|-----------|-------------|
| AIP Functions | `typescript/` | TypeScript functions using GPT-4o for food classification, chat, recipes |
| Python Functions | `python/` | Helper function for null checking in pipeline |
| Pipeline Builder (Java) | `java/` | Auto-generated Java export of the Pipeline Builder logic |
| OSDK React App | `react-app/` | Full-featured 9-page React SPA for kitchen management |

---

## AIP Logic Functions (`typescript/`)

Four AI-powered functions using GPT-4o:

1. **foodGenieImageClassifier** — Identifies food items from uploaded images
2. **foodGenieChat** — Conversational AI chef with context awareness (inventory + dietary rules)
3. **foodGenieIngredientsInfo** — Nutrition info, storage tips, and substitution suggestions
4. **foodGenieRecipeSuggestions** — Personalized recipe generation respecting dietary rules

---

## Python Functions (`python/`)

- **is_food_null** — Checks if a food classification has been performed on an inventory item. Used in automation monitors to trigger the LLM classifier.

---

## Pipeline Builder Java Export (`java/`)

Auto-generated Java code representing the FoodGenie Pipeline Builder logic:
- Creates backing datasets for all 4 Ontology object types
- Handles meal timetable, roommate profiles, dietary bio rules, and image inventory

---

## OSDK React Application (`react-app/`)

A full-featured React SPA built with Palantir's Ontology SDK:
- **Tech Stack:** React 18, TypeScript, Vite, Blueprint.js, OSDK
- **Features:** Image upload, inventory browsing, meal planning, AI chat, recipe generation
- **Auth:** OAuth 2.0 via Palantir Foundry

---

## Ontology Object Types

| Object Type | Description | Primary Key |
|-------------|-------------|-------------|
| FoodGenie Inventory | Kitchen items identified from camera uploads | mediaItemRid |
| FoodGenie Roommates | User profiles | userId |
| FoodGenie Roommates Bio | Dietary rules and preferences per user | ruleId |
| FoodGenie TimeTable | Planned meals with date and type | foodId |

---

## Getting Started

This project is built and run on [Palantir Foundry](https://www.palantir.com/platforms/foundry/). The source code is exported here for reference and version control.

### Prerequisites
- Palantir Foundry enrollment with:
  - AIP (GPT-4o language model access)
  - Pipeline Builder
  - Functions (TypeScript)
  - OSDK application hosting
  - Media Sets (for food image uploads)

---

## Export Details

This repository is automatically synced from Palantir Foundry using a custom export pipeline. Changes should be made in Foundry and re-exported.

**Last export method:** Foundry → GitHub Contents API (automated transforms pipeline)

---

## License

Proprietary. All rights reserved.

**Author:** Hrishikesh Warrier (warrier.h@northeastern.edu)
