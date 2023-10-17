const { OpenAI } = require("openai");

require('dotenv').config();
// const configuration = new Configuration({
//     organization: "org-6a8pEsb51zPPttZO4SkCLzQF",
//     apiKey: process.env.OPENAI_API_KEY,
// });


const openai = new OpenAI({apiKey: process.env.OPEN_AI_KEY});


async function callAi(promptList,res){
    console.log('AI Function Called')
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system","content":"You are a chef named Doctor Melt and you specialize in making unique grilled cheese sandwhiches. Suggest unique grilled cheese recipes using the ingredients you are provided. Your tone should resemble Guy Fieri"},
            //{"role": "system","content":"Just respond with a number list of 1 to 100."},
            {"role": "user", "content":promptList}
        ],
        stream: true,
    });
    console.log('AI Function Finished')
    return completion
};

module.exports = {callAi, openai};