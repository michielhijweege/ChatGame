import express from 'express';
import axios from 'axios';
import { ChatOpenAI } from "@langchain/openai";

const app = express();
const PORT = 3000;

app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

app.listen(PORT, function(err){
    if (err){console.log("Error in server setup")}
    else{
        console.log("Server listening on Port", PORT);
    }
})

app.post("/chat", async (req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Accept');
        const { prompt } = req.body;

        // Check if prompt is provided
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt. Please provide a prompt.' });
        }
        else{
            const model = new ChatOpenAI({
                azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
                azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
                azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
                azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
            })

            const result = await model.invoke(prompt)

            res.json(result.content);
        }
    } catch (error) {
        // Pass the error to Express's default error handler
        next(error);
    }
});

app.get("/trivia", async (req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Accept');

        const resp = await axios.get("https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean");

        // Extract question and correct answer from the API response
        const { question, correct_answer } = resp.data.results[0];

        // Send only the question and correct answer
        res.json({question});
        console.log(question)
    } catch (error) {
        console.error('Error fetching trivia:', error);
        res.status(500).json({ error: 'Failed to fetch trivia' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
});
