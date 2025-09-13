README Generator

A smart tool that automatically generates README files for GitHub repositories.
It fetches repository metadata from the GitHub API and leverages Google Gemini AI to generate a professional, structured README.md.

**I kept user verification in the backend to protect API keys and ensure secure access. Once verified, the frontend triggers README generation, ensuring both security and smooth user experience**

🛠️ Tech Stack

- Node.js / Express – backend API
- GitHub REST API – for repository data
- Google Gemini API – for AI-generated README content
- JavaScript / Fetch API – API handling

BASIC Flow 

1.User Input
-User pastes a GitHub repo link in a single input field.
-Selects whether it’s Public or Private .

2.Public Repo
-No authentication needed.
-fetches repo metadata via GitHub’s public API.
-Gemini API generates README.
-Result shown to user.

3.Private Repo
-User must authenticate (via GitHub OAuth or by providing a token).
-Backend verifies token.
-If valid → fetches private repo metadata.
-Sends it to Gemini → generates README.
-Result shown to user.

**Demo**  


[![Demo](https://raw.githubusercontent.com/ritik125V/Readme-generator/main/Frontend/public/demo.gif)](https://raw.githubusercontent.com/ritik125V/Readme-generator/main/Frontend/public/demo.gif)

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Polished Ui + better error handling ⬇️
[![Demo](https://raw.githubusercontent.com/ritik125V/Readme-generator/main/Frontend/public/uiUpdatesDemo.gif)](https://raw.githubusercontent.com/ritik125V/Readme-generator/main/Frontend/public/uiUpdatesDemo.gif)


# Clone the repository
git clone https://github.com/ritik125V/readme-generator.git
cd readme-generator
# Install dependencies
npm install
# Run the project
npm run dev
