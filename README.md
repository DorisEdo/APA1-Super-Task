
# APA1 Recipe API – Backend

This backend is built with Supabase Edge Functions and written in Deno. It powers my hair recipe functionality for my APA1 assignment 2, providing a RESTful API that my frontend can use to manage recipes.

## 🔍 What this backend does

The API allows you to:

- **GET** all recipes or only specific columns (e.g. `?columns=title`)
- **POST** new recipes to the database
- **PUT** to update existing recipes by `id`
- **DELETE** recipes by `id`
- **GET /subscribe** to simulate real-time subscription (logs changes in the terminal)

All functionality is exposed through a single Edge Function (`recipes`) and integrates with your Supabase project's database table: `recipes`.

---

## ✅ Prerequisites

Before using or modifying this project, make sure you have:

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- A Supabase account and project set up
- [Deno](https://deno.land/) installed (for local testing)
- [Node.js](https://nodejs.org/) (for Supabase CLI support)
- [curl](https://curl.se/) or Postman (for optional manual testing)

---

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone <repository-url>
cd <repository-folder>

2. Install dependencies

npm install
If you are using GitHub Codespaces or another online IDE, prefix all supabase commands with npx.

3. Log into Supabase
supabase login
This opens a browser window and prompts you to authenticate with Supabase.

4. Link to your Supabase project
supabase link --project-ref your_project_id
This connects your local folder with your Supabase project.

🧠 Environment Setup
Create a .env file inside supabase/functions/recipes/ with the following:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
⚠️ This key must be kept secret and should not be committed to version control.

🛠️ Working with the Edge Function
supabase functions new recipes
Your code will go in supabase/functions/recipes/index.ts.

Deploy your function
supabase functions deploy recipes

🧪 Running Tests
This project includes unit tests written using Deno’s built-in testing tools.
deno test --allow-env --allow-net --env-file=supabase/functions/recipes/.env
This ensures your handler behaves correctly across different request types (GET, POST, PUT, DELETE).

📂 Project Structure

supabase/
└── functions/
    └── recipes/
        ├── index.ts         # Main Edge Function handler
        ├── index.test.ts    # Unit tests for the function
        ├── .env             # Environment variables (not committed)

