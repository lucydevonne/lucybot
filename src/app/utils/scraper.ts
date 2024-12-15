import axios from 'axios';
import cheerio from 'cheerio';

// Utility function to clean text
function cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

// Main scraping function
export async function scrapeUrl(url: string) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Clean up the DOM by removing unnecessary elements
        $("script").remove();
        $("style").remove();
        $("noscript").remove();
        $("iframe").remove();

        // Extract valuable content
        const title = $("title").text();
        const metaDescription = $('meta[name="description"]').attr("content") || "";
        const h1 = $("h1").map((_, el) => $(el).text()).get().join(" ");
        const h2 = $("h2").map((_, el) => $(el).text()).get().join(" ");
        
        // Combine all text content from paragraphs
        const paragraphs = $("p").map((_, el) => $(el).text()).get();
        const combinedContent = paragraphs.join(" ");

        return {
            url,
            title: cleanText(title),
            metaDescription: cleanText(metaDescription),
            headings: {
                h1: cleanText(h1),
                h2: cleanText(h2),
            },
            content: cleanText(combinedContent),
            error: null,
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return { error: "Failed to scrape URL" };
    }
}
