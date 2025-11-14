import express from 'express'
// const express = require('express')
const app = express()
const port = 8080

import { Anthropic } from '@anthropic-ai/sdk';
import ANTHROPIC_API_KEY from './secrets.js';
process.env.ANTHROPIC_API_KEY = ANTHROPIC_API_KEY

const anthropic = new Anthropic();

const key_test = async function(req, res) {
    res.send(ANTHROPIC_API_KEY)
}

// GET /example
const example = async function(req, res) {
    const anthropic = new Anthropic();

    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
        {
            role: "user",
            content: "What should I search for to find the latest developments in renewable energy?"
        }
        ]
    });
    res.send(msg);
}

app.get('/', (req, res) => {
    res.send('Event Horizon live!')
})
app.get('/key_test', key_test)
app.get('/example', example)

app.listen(port, () => {
    console.log(`Event Horizon listening on port ${port}`)
})

