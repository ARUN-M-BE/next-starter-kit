import { NextRequest, NextResponse } from "next/server";
import { Firecrawl } from "firecrawl";

// Optional: Initialize Firecrawl if API Key is configured in environment
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "";
const firecrawl = firecrawlApiKey ? new Firecrawl({ apiKey: firecrawlApiKey }) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    console.log(`[Music Search] Crawling information for query: "${query}" using Firecrawl...`);

    // If Firecrawl is configured, execute direct scraping / web search
    if (firecrawl) {
      try {
        const searchResults = (await firecrawl.search(`${query} music song metadata lyrics`, {
          limit: 3,
        })) as any;

        if (searchResults && searchResults.data && searchResults.data.length > 0) {
          // Parse results into a standard structure
          const crawledTracks = searchResults.data.map((item: any, index: number) => ({
            id: `crawled_${index}`,
            title: item.title?.replace(/ - Wikipedia| - Spotify/i, "") || `${query} Track ${index + 1}`,
            artist: item.metadata?.author || "Unknown Artist",
            url: item.url || "#",
            description: item.description || "No crawled description available.",
            markdownSnippet: item.markdown?.substring(0, 400) || "No lyrics markdown available.",
          }));

          return NextResponse.json({
            success: true,
            provider: "Firecrawl Web Crawler",
            tracks: crawledTracks,
          });
        }
      } catch (scrapeErr: any) {
        console.warn("[Firecrawl SDK Warning] Search failed or API rate limit hit. Falling back to sandbox database.", scrapeErr.message);
      }
    }

    // Fallback sandbox tracks when Firecrawl key is not provided (or limits hit)
    // Providing highly detailed mock crawled results for standard songs
    const mockTracks = [
      {
        id: "mock_crawled_1",
        title: `${query} - Synthetic Wave`,
        artist: "Digital Resonance",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        description: `crawled metadata for: "${query}" from synthetic sound clouds.`,
        markdownSnippet: "### Lyrics (Crawled Snippet)\n\n[Verse 1]\nEchoes in the electric sky\nSignals flying high\nLooking for the coding groove\nWaiting for the beat to move..."
      },
      {
        id: "mock_crawled_2",
        title: `${query} - Retro Vibe`,
        artist: "Neon Skyline",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        description: `crawled metadata for: "${query}" from retro synth networks.`,
        markdownSnippet: "### Lyrics (Crawled Snippet)\n\n[Chorus]\nNeon lights guide the route\nTurn the bass up, hear the shout\nCoding all through the midnight zone\nWe are never dancing alone..."
      },
      {
        id: "mock_crawled_3",
        title: `${query} - Lo-Fi Chill`,
        artist: "Acoustic Nodes",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        description: `crawled metadata for: "${query}" from acoustic workspace relays.`,
        markdownSnippet: "### Lyrics (Crawled Snippet)\n\n[Verse 2]\nQuiet strings and coffee cups\nDebugging till the sun comes up\nLet the low frequency take the lead\nEverything a developer could need..."
      }
    ];

    // Artificial delay to simulate crawl scraping
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      provider: "Firecrawl Sandbox Fallback (No API Key Configured)",
      tracks: mockTracks,
    });
  } catch (error) {
    console.error("Music Search Scraper Route Error:", error);
    return NextResponse.json({ error: "Internal server error during music search" }, { status: 500 });
  }
}
