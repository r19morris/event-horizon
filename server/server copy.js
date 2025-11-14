import express from 'express'

// NEW 
import {ChromaClient} from "chromadb";

const client = new ChromaClient({path: "http://localhost:8080"});

async function queryByCity(city, question, nResults = 5) {
  const collection = await client.getCollection({ name: "travel_data" });

  const result = await collection.query({
    queryTexts: [question],      // what the user asked
    nResults,
    where: { city: city.toLowerCase() }, // <-- metadata filter
  });

  return result;
}

// export async function queryChroma() {
//   const collection = await client.getCollection({ name: "travel_data" });

//   const res = await collection.query({
//     nResults: 5,
//     queryTexts: ["paris restaurant french bistro"],
//     where: { city: "paris" } // matches your metadata
//   });

//   console.log(JSON.stringify(res, null, 2));
// }

// END NEW


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
    // NEW
    const city = (req.query.destination || "paris").toLowerCase();
    // const question = req.query.question || "best restaurants and things to do for three days";

    const ragResult = await queryByCity(city, question, 5);
    const docs = ragResult.documents?.[0] || [];
    const context = docs.join("\n\n");
 // origin, destination, start_date, end_date, people, constraints
    const start = new Date(req.query.start_date);
    const end = new Date(req.query.end_date);
    const num_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const prompt = `You are a travel planner. Create a ${num_days}-day itinerary for ${req.query.destination}.

    REQUIREMENTS:
    - Dates: ${start_date} to ${end_date} (${num_days} days)
    - Travelers: ${req.query.people}
    - Interests: ${req.query.constraints}

    AVAILABLE INFORMATION:
    ${context}

    Create a realistic daily schedule with:
    - Specific times (use 24-hour format like "09:00")
    - Activity names and descriptions
    - Locations
    - Estimated duration in minutes
    - Estimated costs

    Return ONLY valid JSON in this exact format:
    {
    "daily_plans": [
        {
        "date": "${start_date}",
        "day_number": 1,
        "items": [
            {
            "time": "09:00",
            "activity": "Activity name",
            "location": "Address or area",
            "description": "What you'll do here",
            "duration_minutes": 120,
            "cost": 25.00
            }
        ]
        }
    ],
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
    }

    Include 4-6 activities per day. Mix meals, attractions, and free time.
    RESPOND ONLY WITH JSON, NO OTHER TEXT.`;


    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
        {
            role: "user",
            content: prompt
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

