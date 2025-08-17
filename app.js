import "dotenv/config";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 5000;
console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index", {
    corrected: "",
    originalText: "",
  });
});
app.post("/correct", async (req, res) => {
  const text = req.body.text.trim();
  if (!text) {
    return res.render("index", {
      corrected: "Please enter some text to correct",
      originalText: text,
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Correct the grammar and spelling of the following text:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const correctedText = result.response.text();

    res.render("index", {
      corrected: correctedText,
      originalText: text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.render("index", {
      corrected: "Error. Please try again.",
      originalText: text,
    });
  }
});
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
