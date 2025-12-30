import { GoogleGenAI } from "@google/genai";
import { CharacterInputs } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateCharacterSheet = async (inputs: CharacterInputs): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const prompt = `
    Create a "Panoramic Character Depth Deconstruction Sheet" (Concept Art Character Sheet) based on the following details:
    
    Character Name: ${inputs.name || 'Unnamed'}
    Archetype: ${inputs.archetype || 'Unknown'}
    Core Appearance: ${inputs.appearance}
    Clothing/Outfit: ${inputs.clothing}
    Accessories/Inventory: ${inputs.accessories}
    Key Expressions: ${inputs.expressions || 'Neutral, Angry, Happy'}
    Secret/Private Item: ${inputs.secretItem || 'None'}

    VISUAL GUIDELINES:
    1. CENTER ANCHOR: A high-quality Full-Body Portrait of the character in the center.
    2. BACKGROUND: A technical "Manga Grid/Graph Paper" texture, looking like a designer's sketchbook.
    3. SURROUNDING ELEMENTS:
       - Deconstruct the outfit (show layers separately).
       - 3-4 distinct facial expression headshots in the corners.
       - "Exploded" view of their bag contents or inventory items.
       - A detailed close-up of the "Secret/Private Item" (industrial design perspective).
    4. ANNOTATIONS: Include handwritten-style notes and guide lines/arrows connecting items to the character.
    5. STYLE: High-quality 2D Anime/Game Concept Illustration. Clean, sharp line work.
    
    Ensure the image is high resolution (1K or higher).
  `;

  const parts: any[] = [{ text: prompt }];

  if (inputs.image) {
    const imagePart = await fileToGenerativePart(inputs.image);
    parts.push(imagePart);
    parts.push({ text: "Use the attached image as the primary visual reference for the character's design and style." });
  }

  try {
    // Using gemini-3-pro-image-preview for high quality image generation as requested
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9", // Panoramic feel
            imageSize: "1K"
        }
      },
    });

    const generatedImage = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
    );

    if (generatedImage && generatedImage.inlineData) {
      return `data:image/png;base64,${generatedImage.inlineData.data}`;
    } else {
      throw new Error("No image data returned from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
