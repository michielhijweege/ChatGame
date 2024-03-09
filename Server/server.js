import { ChatOpenAI } from "@langchain/openai"
import express from 'express';
const app = express();
const PORT = 3000;

app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

app.post("/chat", async (req, res) => {
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
        console.log(result.content)
        res.json(result.content);
    }
});

//npm install cors
//import cors from 'cors';
//app.use(cors());