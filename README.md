# 🍳 FoodGenie AIP — AI-Powered Shared Kitchen Management

> Built entirely on **Palantir Foundry** using the **Ontology**, **AIP Logic**, **Pipeline Builder**, **OSDK**, and **Workshop** — a full-stack AI application from data ingestion to production deployment.

FoodGenie helps roommates manage their shared kitchen inventory, plan meals, generate personalized recipes, and get real-time cooking assistance — all while respecting individual dietary preferences, allergies, and restrictions.

[![FoodGenie Demo](https://img.youtube.com/vi/Cj1Rm57at04/0.jpg)](https://youtu.be/Cj1Rm57at04)

▶️ **[Watch the Full Demo on YouTube](https://youtu.be/Cj1Rm57at04)**

---

## 🏗️ Platform Architecture

This project demonstrates an end-to-end **Palantir Foundry** workflow — from raw data ingestion through ontology modeling to production AI applications:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         PALANTIR FOUNDRY PLATFORM                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📸 Camera Upload ──→ Media Set ──→ Object Monitor ──→ AIP Logic Trigger    │
│                                          │                                   │
│                                          ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    PIPELINE BUILDER                              │        │
│  │  Media Set → LLM Classifier → Inventory Dataset                 │        │
│  │  Manual Data → Roommates / Bio / Timetable Datasets             │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                          │                                   │
│                                          ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                      ONTOLOGY LAYER                              │        │
│  │  Object Types: Inventory ←→ Roommates ←→ Bio ←→ TimeTable      │        │
│  │  Link Types: userId-based relationships                         │        │
│  │  Action Types: UpdateFood (Ontology Edit)                       │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                          │                                   │
│                                          ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                   AIP LOGIC FUNCTIONS                            │        │
│  │  🤖 Image Classifier (GPT-4o) — food identification             │        │
│  │  💬 Chat (GPT-4o) — context-aware cooking assistant             │        │
│  │  📊 Ingredients Info (GPT-4o) — nutrition & storage             │        │
│  │  🍽️ Recipe Suggestions (GPT-4o) — personalized generation       │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                          │                                   │
│                              ┌───────────┴───────────┐                      │
│                              ▼                       ▼                       │
│                    ┌──────────────┐        ┌──────────────┐                 │
│                    │  WORKSHOP    │        │  OSDK REACT  │                 │
│                    │  (Low-Code)  │        │  (Pro-Code)  │                 │
│                    └──────────────┘        └──────────────┘                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Palantir AIP & Ontology

### The Ontology — Semantic Data Model

The **Foundry Ontology** maps raw datasets to real-world entities. FoodGenie's ontology models kitchen management as interconnected objects:

| Object Type | Description | Primary Key | Backing Source |
|---|---|---|---|
| **FoodGenie Inventory** | Kitchen items identified via AI from uploaded food images | `mediaItemRid` | Pipeline Builder + LLM |
| **FoodGenie Roommates** | User profiles for each roommate | `userId` | Pipeline Builder |
| **FoodGenie Roommates Bio** | Dietary rules, allergies, and preferences per user | `ruleId` | Pipeline Builder |
| **FoodGenie TimeTable** | Planned meals with date, type, and who's cooking | `foodId` | Pipeline Builder |

**Link Types** connect objects through `userId` foreign keys, enabling the AI functions to traverse relationships (e.g., fetch a user's dietary rules when generating recipes).

### AIP Logic — No-Code AI Functions

FoodGenie's intelligence comes from **4 AIP Logic functions** powered by **GPT-4o**. These were authored in Palantir's no-code AIP Logic environment, then **exported to TypeScript** for version control and portability:

| Function | Purpose | Ontology Context Used |
|---|---|---|
| `foodGenieImageClassifier` | Identifies food from uploaded images | Inventory objects |
| `foodGenieChat` | Conversational AI chef | User's bio rules + full kitchen inventory |
| `foodGenieIngredientsInfo` | Nutrition, storage tips, substitutions | Ingredient name |
| `foodGenieRecipeSuggestions` | Personalized recipe generation | Bio rules + inventory + meal history |

Each function queries the **Ontology** at runtime to personalize responses — respecting allergies (e.g., nut-free), dietary choices (e.g., vegetarian), and preferences (e.g., no food repetition within 3 days).

### Automation — Object Monitors

An **Object Monitor** watches the Inventory object type. When a new image is uploaded (with no food classification yet), it automatically triggers the `UpdateFood` action → calls the `foodGenieImageClassifier` AIP Logic → writes the identified food name back to the object. Zero human intervention.

---

## 📂 Repository Structure

```
food-genie-aip/
├── README.md                          # This file
├── typescript/                        # AIP Logic functions (TypeScript export)
│   └── src/index.ts                   # All 4 AI functions using GPT-4o
├── python/                            # Python Functions
│   └── extract_array.py               # Helper for pipeline null-checking
├── java/                              # Pipeline Builder (Java export)
│   └── src/
│       ├── PipelineLogic.java         # Full pipeline transformation logic
│       └── PipelineOutputs.java       # Output dataset container
└── react-app/                         # OSDK React Application
    ├── package.json                   # Dependencies (OSDK, Blueprint.js, React 18)
    └── src/
        ├── main.tsx                   # App entry with OsdkProvider
        ├── client.ts                  # OSDK client + OAuth configuration
        ├── router.tsx                 # React Router setup
        └── Home.tsx                   # Landing page component
```

---

## 🔧 Palantir Applications Used

### Pipeline Builder → Java Export

The data pipeline was built using **Palantir Pipeline Builder** — a no-code, point-and-click application for constructing data transformations. It handles:
- Ingesting images from the Media Set
- Running the LLM image classifier step
- Creating structured datasets for all 4 Ontology object types
- Handling schema transformations and column mappings

The Pipeline Builder logic was then **auto-exported to Java** (see `java/` directory) for version control and reproducibility. This Java code represents the exact transformation graph that Pipeline Builder executes.

### AIP Logic → TypeScript Export

All 4 AI functions were authored in **Palantir AIP Logic** — a no-code development environment for building LLM-powered functions. AIP Logic provides:
- Visual function authoring with prompt engineering
- Direct Ontology object access (search, filter, traverse links)
- Built-in GPT-4o integration via Foundry's Language Model API
- One-click deployment to the Ontology

These functions were then **re-implemented in TypeScript** (see `typescript/` directory) using Foundry's Functions framework (`@foundry/functions-api`) for:
- Full source control and code review
- External portability and documentation
- Type-safe Ontology access via `@foundry/ontology-api`

### Workshop (Low-Code App)

A **Workshop application** provides the low-code operational interface — built with drag-and-drop widgets for inventory management, meal planning, and AI interactions.

### OSDK React Application (Pro-Code App)

A full-featured **9-page React SPA** built with Palantir's Ontology SDK (`@osdk/client`, `@osdk/react`):
- **Tech Stack:** React 18, TypeScript, Vite, Blueprint.js
- **Auth:** OAuth 2.0 via Palantir Foundry
- **Features:** Image upload, inventory browsing, meal planning calendar, AI chat interface, recipe generation, ingredient info lookup
- **Deployment:** Hosted on Foundry as a registered third-party application

### Python Functions

A **Python Function** (`is_food_null`) is used within the Pipeline Builder to check whether an inventory item's food field has been classified yet — enabling conditional logic in the automation pipeline.

---

## 🔄 Export Pipeline

This GitHub repository is **automatically synced from Palantir Foundry** using a custom transforms-python pipeline:

1. **File Manifest Transform** — bundles all source code into a structured dataset
2. **GitHub Export Transform** — uses Foundry's `@external_systems` decorator with a Data Connection source to push files via the GitHub Contents API

To re-export: simply rebuild the pipeline in Foundry. The export handles both creates and updates (checks SHA for existing files).

---

## 🚀 Key Foundry Concepts Demonstrated

| Concept | How It's Used |
|---|---|
| **Ontology** | 4 object types with link types modeling kitchen domain |
| **AIP Logic** | No-code LLM-powered functions for food AI |
| **Pipeline Builder** | No-code data pipeline creating ontology backing datasets |
| **Media Sets** | Food image storage with media references on objects |
| **Object Monitors** | Auto-triggers image classification on new uploads |
| **Action Types** | `UpdateFood` action for ontology edits from AI |
| **Workshop** | Low-code operational application |
| **OSDK** | Pro-code React app with full Ontology access |
| **Data Connection** | GitHub REST API integration for automated export |
| **Functions (TypeScript)** | Type-safe re-implementation of AIP Logic |
| **Functions (Python)** | Helper logic for pipeline conditional checks |
| **External Systems** | Egress to GitHub API via configured source |

---

## 👤 Author

**Hrishikesh Warrier**  
📧 warrier.h@northeastern.edu  
🎓 Northeastern University

---

## 📄 License

Proprietary. All rights reserved.
