import { Anthropic } from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from './secrets.js';

const anthropic = new Anthropic();

const key_test = async function(req, res) {
    res.send(ANTHROPIC_API_KEY)
}

// GET /example
const example = async function(req, res) {
    const response = await anthropic.beta.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
            {
            role: "user",
            content: [
                {
                type: "text",
                text: "Please summarize this document for me."
                },
                {
                type: "document",
                source: {
                    type: "file",
                    file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
                }
                }
            ]
            }
        ],
        betas: ["files-api-2025-04-14"],
    });
}

module.exports = {
    example
}