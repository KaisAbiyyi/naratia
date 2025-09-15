import { Metadata } from "next";
import Link from "next/link";
import { CreateStoryForm } from "@/components/stories/CreateStoryForm";

export const metadata: Metadata = {
  title: "Create New Story - Naratia | Start Your Collaborative Adventure",
  description:
    "Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph that will captivate our community of writers and readers.",
  keywords: [
    "create story",
    "start story",
    "new collaborative story",
    "write opening paragraph",
    "story creation",
    "naratia create",
    "begin story",
    "collaborative writing",
    "interactive fiction creator",
    "story genres",
    "content tiers",
  ],
  authors: [{ name: "Naratia Team" }],
  creator: "Naratia",
  publisher: "Naratia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://naratia.com"),
  openGraph: {
    title: "Create New Story - Naratia | Start Your Collaborative Adventure",
    description:
      "Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph that will captivate our community of writers.",
    url: "https://naratia.com/stories/create",
    siteName: "Naratia",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-create-story.jpg",
        width: 1200,
        height: 630,
        alt: "Create New Collaborative Story on Naratia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Create New Story - Naratia | Start Your Collaborative Adventure",
    description:
      "Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph.",
    images: ["/og-create-story.jpg"],
    creator: "@naratia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://naratia.com/stories/create",
  },
  category: "Entertainment",
};

// Server component to handle genres fetching
export default async function CreateStoryPage() {
  let availableGenres: Array<{
    id: string;
    name: string;
    description?: string;
    colorHex?: string;
    iconName?: string;
    minContentTier: string;
  }> = [];

  try {
    // Fetch available genres from API endpoint
    console.log("Fetching genres from API...");
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://naratia.vercel.app';
    const response = await fetch(`${baseUrl}/api/genres`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      availableGenres = result.data.map((g: {
        id: string;
        name: string;
        description?: string;
        color_hex?: string;
        icon_name?: string;
        min_content_tier: string;
      }) => ({
        id: g.id,
        name: g.name,
        description: g.description || undefined,
        colorHex: g.color_hex || undefined,
        iconName: g.icon_name || undefined,
        minContentTier: g.min_content_tier || "general",
      }));
      console.log("Successfully fetched genres from API:", availableGenres.length);
    } else {
      throw new Error("Invalid API response format");
    }

  } catch (error) {
    console.error("Error loading genres from API:", error);

    // Fallback: provide some default genres if API is not available
    availableGenres = [
      { id: "temp-1", name: "Fantasy", minContentTier: "general" },
      { id: "temp-2", name: "Science Fiction", minContentTier: "general" },
      { id: "temp-3", name: "Mystery", minContentTier: "general" },
      { id: "temp-4", name: "Romance", minContentTier: "teen" },
      { id: "temp-5", name: "Adventure", minContentTier: "general" },
    ];
    console.log("Using fallback genres due to API error");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Story
            </h1>
            <p className="text-muted-foreground mt-2">
              Start a collaborative adventure that others can join and help
              shape
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <CreateStoryForm genres={availableGenres} />
          </div>

          {/* Guidelines */}
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Story Creation Guidelines</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Your opening paragraph should be engaging and leave room for
                  others to continue
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Choose appropriate genres and content tier for your
                  story&apos;s theme
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Keep opening paragraphs between 50-500 words for best
                  engagement
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Stories become community property once published - others can
                  contribute freely
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Be respectful and follow community guidelines for content
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
