import Groq from 'groq-sdk';

// Define the structure of the response expected from Groq
interface GroqResponse {
    message: string;
}

// Initialize the Groq client with the API key 
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to fetch data from the Groq API
export const fetchGroqData = async (message: string) => {
    try {
        // Create a chat completion request to the Groq API
        const response = await client.chat.completions.create({
            messages: [
                { role: 'user', content: message } // Send the user's message to the model
            ],
            model: 'llama3-70b-8192' 
        });
        // Return the content of the first choice from the response
        return response.choices[0].message.content;  
    } catch (error) {
        console.error("Error fetching data from Groq:", error);
        throw error;
    }
};
