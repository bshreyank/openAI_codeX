import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,OpenAIApi } from 'openai';
import { env } from 'process';

dotenv.config();

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    res.status(200).send({
        message:'Hello from CodeX',
    })
});

//Q)what is the difference between app.post() and app.get()
//A)With app.get() route you cant really receive a lot of data from the front end, but the post one allows us to have a body or a payload  

app.post('/',async(req,res)=>{

    try {
        const prompt = req.body.prompt;
        
        //most important thing
        //we want a response from openai
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,     //textarea from html file
            temperature:0,          //higher the temperature value, meaning the model will take more risk in giving answers. Puting it 0 will give exact what it knows
            max_tokens:3000,        //Maximum number of tokens to generate in completion. 3000 max_token which means it gives pretty long responses. 
            top_p:1,                //
            frequency_penalty:0.5,  //This means that it will not repeat similar sentences more often.
            presence_penalty:0,
        });
        res.status(200).send({
            bot:response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong')
    }
})

app.listen(5000,() => console.log('Server is running on port http://localhost:5000') );      


