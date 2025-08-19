// src/pages/api/quizzes.js
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    const filenames = await fs.readdir(quizzesDir);
    const jsonFiles = filenames.filter(file => file.endsWith('.json'));

    const quizDataPromises = jsonFiles.map(async (fileName) => {
      const filePath = path.join(quizzesDir, fileName);
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // If the subject is a valid, non-empty string, use it. Otherwise, set it to null.
        const subject = (jsonData.subject && String(jsonData.subject).trim()) 
                        ? String(jsonData.subject).trim() 
                        : null; // Use null for empty or missing subjects

        return {
          fileName: fileName,
          subject: subject 
        };
        
      } catch (e) {
        console.error(`Error processing file ${fileName}:`, e);
        return null; 
      }
    });

    const resolvedQuizData = await Promise.all(quizDataPromises);
    const validQuizData = resolvedQuizData.filter(item => item !== null);

    return new Response(
      JSON.stringify(validQuizData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('API Error fetching quizzes:', error);
    return new Response(
      JSON.stringify({ message: 'Could not load quiz files.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}