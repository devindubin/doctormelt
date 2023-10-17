const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io')
const io = new Server(server)
const path = require('path');


require('dotenv').config();
const ai = require('./src/utils.js');

// Define static
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// Define routes
//if index.html file is in public, that will always be the base url
app.get('/', (req, res) => {
  res.send("<p> Hello World</p>")
});

app.get('/cheesy',(req,res) => {
  res.sendFile(path.join(__dirname,'/public/','main.html'))
})

app.get('/stream',(req,res)=>{
  res.sendFile(path.join(__dirname,'/public/','main1.html'));
});

// app.post('/',async (req,res) => {
//   let dict = await req.body;
//   console.log('Request Body: ',dict);
//   let values = Object.values(dict);
//   let ingredients = values.join(", ")
  
//   let completion = await ai.callAi(ingredients);
  
//   // for await (const chunk of completion){
//   //   try {
//   //     res.write(chunk.choices[0].delta.content)  
//   //   } catch (error) {
//   //     console.log(error)
//   //   }
    
    
//   // }

  
//   res.send(completion);
  
// });

// Socket
io.on('connection',(socket)=>{
  console.log(
    'user connected'
  )
})
io.on('connection', (socket) =>{
  socket.on('chat message',(msg) =>{
    io.emit('chat message',msg);
  })
})

io.on('connection', (socket) => {
  socket.on('submission',async (out) =>{
    console.log('Emitted Values (ingredients) from form: ', out)   
    let values = Object.values(out);
    let ingredients = values.join(", ")
    const completion = await ai.callAi(ingredients)
    
    for await (const chunk of completion){
      io.emit('submission',chunk);

    }
  })
  

})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`localhost:${PORT}`);
});
