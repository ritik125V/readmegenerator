import { use, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { getData, getPrivateData } from "../api/getReadme.js";
import { Github, Copy, Loader } from "lucide-react";
import Typed from "typed.js";

function App() {
  const [Readme, setReadme] = useState("");
  const [Link, setLink] = useState("");
  const [privateSelected, setprivateSelected] = useState(false);
  const [Loading, setLoading] = useState(false);

  function handleOption(value) {
    if (value === "public") {
      publicRepo(Link);
    } else {
      privateRepo(Link);
    }
  }

  async function publicRepo(link) {
    setLoading(true);
    const readme = await getData(link);
    if (!readme) alert("Invalid Link");
    setReadme(readme);
    setLoading(false);
    setLink("");
  }
async function privateRepo(link) {
  setLoading(true);
  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      alert("Invalid GitHub repository link.");
      return;
    }
    const [owner, repo] = parts;
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const res = await axios.get(`${baseURL}/private-repo`, {
      params: { owner, repo },
      withCredentials: true,
    });
    console.log("res: ", res);
    
    
    if (res.data.success) {
      const readme = await getPrivateData(JSON.stringify(res.data.data));
      setReadme(readme);
    } else {
      alert(`Failed to fetch repository: ${res.data.error || "Unknown error"}`);
    }
  } catch (error) {
      console.error("error: ", error);
      setReadme(error);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    if (!Readme) return;

    const typed = new Typed("#readme", {
      strings: [String(Readme)],
      typeSpeed: 2,
      loop: false,
      showCursor: false,
    });

    return () => typed.destroy();
  }, [Readme]);

  return (
    <>
      <div className="bg-black flex flex-col items-center text-white min-h-screen py-6 px-4">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-6 text-center">
          Link Daalo , Readme Nikalo <span className="inline-block">📝</span>
        </h1>

        {/* Input Section */}
        <div className="w-full max-w-md flex flex-col gap-4 bg-neutral-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-neutral-800">
          <input
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm md:text-base placeholder-neutral-500"
            type="text"
            value={Link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter repository URL..."
          />

          {/* Repo Type Selection */}
          <div className="flex items-center justify-between text-sm font-medium text-neutral-300">
            <p>Select repository type:</p>
            <div className="flex overflow-hidden rounded-lg border border-neutral-700">
              <button
                className={`px-3 py-1 transition ${
                  !privateSelected
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-900 text-neutral-400"
                }`}
                onClick={() => setprivateSelected(false)}
              >
                Public
              </button>
              <button
                className={`px-3 py-1 transition ${
                  privateSelected
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-900 text-neutral-400"
                }`}
                onClick={() => setprivateSelected(true)}
              >
                Private
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-95 transition rounded-lg py-2 font-semibold text-white flex items-center justify-center gap-2"
              onClick={() =>
                handleOption(privateSelected ? "private" : "public")
              }
            >
              {Loading ? (
                <>
                  <Loader className="animate-spin w-4 h-4" /> Loading...
                </>
              ) : (
                "Generate Readme"
              )}
            </button>
            <button
              className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 transition rounded-lg px-3 font-medium border border-neutral-700"
              onClick={() => (window.location.href = "http://localhost:3000/")}
            >
              <Github className="w-4 h-4" /> Login
            </button>
          </div>
        </div>

        {/* Readme Display */}
        {Readme && (
          <div className="w-full max-w-3xl bg-neutral-900 mt-6 rounded-2xl shadow-lg border border-neutral-800 overflow-hidden">
            <div className="flex justify-between items-center border-b border-neutral-800 px-4 py-3">
              <p className="font-semibold text-neutral-300">Generated README</p>
              <button
                className="text-xs font-semibold flex gap-1 items-center px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition active:scale-95"
                onClick={() => navigator.clipboard.writeText(Readme)}
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <pre
              id="readme"
              className="whitespace-pre-wrap font-mono text-sm text-neutral-200 px-4 py-3 overflow-x-auto"
            >
              {Readme}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
