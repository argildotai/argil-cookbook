# Notion to Argil Video Generator

This project automatically generates videos using the Argil AI API based on content from Notion pages. It fetches child pages from a specified Notion parent page, converts the content into video moments, and then uses Argil AI to create and render videos.

## Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)
- A Notion account with API access
- An Argil AI account with API access

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/notion-to-argil-video-generator.git
   cd notion-to-argil-video-generator
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add your API keys:
   ```
   NOTION_API_KEY=your_notion_api_key
   ARGIL_API_KEY=your_argil_api_key
   NOTION_PARENT_PAGE_ID=your_notion_parent_page_id
   ```

## Configuration

Open the `index.ts` file and update the following constants if needed:

- `DEFAULT_AVATAR_ID`: The ID of the default avatar to use for video generation
- `DEFAULT_VOICE_ID`: The ID of the default voice to use for video generation

## Usage

1. Ensure your Notion parent page contains child pages with the content you want to convert into videos.

2. Run the script:
   ```
   npm start
   ```

3. The script will process each child page, create a video using Argil AI, and initiate the rendering process.

4. Check the console output for the results of video creation and rendering.

## Important Notes

- Make sure your Notion API key has the necessary permissions to access the specified parent page and its child pages.
- The Argil AI API usage may incur costs. Please check your Argil AI account for pricing details.
- This script uses the default avatar and voice for all videos. You can modify the `convertPageToMoments` function to customize avatars and voices for different content if needed.

## Troubleshooting

If you encounter any issues:

1. Ensure all API keys are correct and have the necessary permissions.
2. Check that the Notion parent page ID is correct and contains child pages.
3. Verify that your Argil AI account is active and has available credits for video generation.

For any other issues, please check the error messages in the console output and refer to the Notion and Argil AI documentation.

## License

[MIT License](LICENSE)