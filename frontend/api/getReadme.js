import { GoogleGenAI } from "@google/genai";

async function ReadmeGenerate({ msg }) {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an expert GitHub README writer.

Based on this GitHub repository metadata, generate a **crisp, professional, and beginner-friendly README.md**. 
- Include sections: Title, Overview, Features, Technologies Used, Installation, Deployment, Contributing, License. 
- Keep it concise but clear. 
- Use Markdown formatting with headings, code blocks, and links where appropriate. 
- Highlight key points like tech stack, project purpose, and deployment URL. 
- Do not add unnecessary filler text.
- Ensure the README is user-friendly and easy to navigate.
- Do not add much symbols like * or #.
- you can add emojis like 🚀 ,🔴,🔵,🟢 insted of symbols.
-if any error message appears, include it in the response , and just include the error message without any additional text.
Repository metadata:
${msg}  `,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating README:", error);
  }
}

async function getData(link) {
  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);
    const [owner, repo] = parts;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const data = await fetch(apiUrl);
    if (!data.ok) {
      return `[ ${link} ] is a private repo or link is broken , login and try again..`;
    } else {
      const metaData = await data.json();
      const readme = await ReadmeGenerate({ msg: JSON.stringify(metaData) });
      return readme;
    }
  } catch (error) {
    return `[ ${link} ] is not a valid link , try again..`;
  }
}

async function getPrivateData(data) {
  try {
    const readme = await ReadmeGenerate({ msg: data });
    return readme;
  } catch (error) {
    return `[unable to generate readme ,error : ${error} ] `;
  }
}



export { getData, getPrivateData };
