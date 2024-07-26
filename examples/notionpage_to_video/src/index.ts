import { Client } from '@notionhq/client';
import fetch from 'node-fetch';

// Constants
const NOTION_API_KEY = 'YOUR_NOTION_API_KEY';
const ARGIL_API_KEY = 'YOUR_ARGIL_API_KEY';
const ARGIL_API_URL = 'https://api.argil.ai/v1/videos';
const NOTION_PARENT_PAGE_ID = 'YOUR_NOTION_PARENT_PAGE_ID';

// Lao licensed avatar actor id
const DEFAULT_AVATAR_ID = "8e0fd808-e441-4573-b6be-7d8a5762c330";
// Lao licensed voice actor id
const DEFAULT_VOICE_ID = "eddb856d-3ffe-4ede-a55a-ef0c3893535f";

// Notion API setup
const notion = new Client({ auth: NOTION_API_KEY });

interface NotionPage {
    id: string;
    title: string;
    content: string;
}

interface Moment {
    transcript: string;
    avatarId: string;
    voiceId: string;
}

interface VideoCreationRequest {
    name: string;
    moments: Moment[];
    extras: Record<string, unknown>;
}

async function getChildPages(parentPageId: string): Promise<NotionPage[]> {
    const response = await notion.blocks.children.list({ block_id: parentPageId });
    const childPages: NotionPage[] = [];

    for (const block of response.results) {
        if ('type' in block && block.type === 'child_page') {
            const pageInfo = await notion.pages.retrieve({ page_id: block.id });
            const content = await getPageContent(block.id);
            if ('properties' in pageInfo && 'title' in pageInfo.properties) {
                const titleProperty = pageInfo.properties.title;
                if ('title' in titleProperty && titleProperty.title.length > 0) {
                    childPages.push({
                        id: block.id,
                        title: titleProperty.title[0].plain_text,
                        content: content
                    });
                }
            }
        }
    }

    return childPages;
}

async function getPageContent(pageId: string): Promise<string> {
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    let content = '';

    for (const block of blocks.results) {
        if ('type' in block && block.type === 'paragraph' && 'paragraph' in block) {
            const paragraph = block.paragraph;
            if ('rich_text' in paragraph) {
                content += paragraph.rich_text.map((t: any) => t.plain_text).join(' ') + '\n\n';
            }
        }
    }

    return content.trim();
}

function convertPageToMoments(page: NotionPage): Moment[] {
    const paragraphs = page.content.split('\n\n');

    return paragraphs.map(paragraph => ({
        transcript: paragraph,
        avatarId: DEFAULT_AVATAR_ID,
        voiceId: DEFAULT_VOICE_ID
    }));
}

async function createVideo(videoData: VideoCreationRequest): Promise<any> {
    const response = await fetch(ARGIL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ARGIL_API_KEY
        },
        body: JSON.stringify(videoData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function renderVideo(videoId: string): Promise<any> {
    const response = await fetch(`${ARGIL_API_URL}/${videoId}/render`, {
        method: 'POST',
        headers: {
            'x-api-key': ARGIL_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function generateVideosFromNotion(notionPageId: string): Promise<void> {
    try {
        console.log("Fetching child pages...");
        const childPages = await getChildPages(notionPageId);

        for (const page of childPages) {
            console.log(`Processing page: ${page.title}`);

            console.log("Converting page content to video moments...");
            const moments = convertPageToMoments(page);

            console.log("Moments:", moments);

            console.log("Creating video...");
            const videoData: VideoCreationRequest = {
                name: page.title,  // Using the page title as the video name
                moments: moments,
                extras: {}
            };

            const createResult = await createVideo(videoData);
            console.log("Video creation result:", JSON.stringify(createResult, null, 2));

            console.log("Initiating video rendering...");
            const renderResult = await renderVideo(createResult.id);
            console.log("Video render result:", JSON.stringify(renderResult, null, 2));
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Usage
generateVideosFromNotion(NOTION_PARENT_PAGE_ID).catch(console.error);