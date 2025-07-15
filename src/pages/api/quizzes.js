// src/pages/api/quizzes.js
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the full path to the public/quizzes directory
    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes');
    
    // Read the directory contents
    const filenames = await fs.readdir(quizzesDir);
    
    // Filter for .json files only
    const jsonFiles = filenames.filter(file => file.endsWith('.json'));

    // Return the list of filenames as a JSON response
    return new Response(
      JSON.stringify(jsonFiles), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('API Error fetching quizzes:', error);
    // Return an error response if the directory can't be read
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
