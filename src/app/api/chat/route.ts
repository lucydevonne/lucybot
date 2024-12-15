import { Middleware } from './../../../../node_modules/next/dist/build/swc/types.d';
// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer

import { NextResponse } from "next/server";
import { fetchGroqData } from "@/app/utils/groqClient";
import { redis } from "@/middleware"; 
import { Logger } from "@/app/utils/logger"

export async function POST(req: Request) {
    try {


      // Parse incoming JSON request body to get the user message 
        const { message } = await req.json();

      // Prepare context for the AI request
        // Start with an initial greeting and current user message
        const context = `AI: Hello! How can I help you today?\nUser: ${message}`;

      // Send combined context and current message to Groq API
      const response = await fetchGroqData(context);



      // Return the AI's response as JSON
      return NextResponse.json({ message: response });

    } catch (error) {
    

        console.error("Error in Groq API call:", error);
        return NextResponse.json({ error: true, message: "An error occurred processing your request" }, { status: 500 });
    }
}
