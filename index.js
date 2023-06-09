const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d8lmf1g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const popularClassesCollection = client.db("Shippo-Sports").collection("popularClasses")
    const popularInstructorsCollection = client.db("Shippo-Sports").collection("popularInstructors")
    const instructorsCollection = client.db("Shippo-Sports").collection("instructors")
    const classesCollection = client.db("Shippo-Sports").collection("classes")
    const selectedClassCollection = client.db("Shippo-Sports").collection("selected")


    app.get('/popularClasses', async(req, res)=>{
        const result = await popularClassesCollection.find().toArray();
        res.send(result);
    })

    app.get('/popularInstructors', async(req, res)=>{
        const result = await popularInstructorsCollection.find().toArray();
        res.send(result);
    })

    app.get('/instructors', async(req, res)=>{
        const result = await instructorsCollection.find().toArray();
        res.send(result);
    })
    
    app.get('/classes', async(req, res)=>{
        const result = await classesCollection.find().toArray();
        res.send(result);
    })

    // class related api 
    app.post('/select', async(req, res)=>{
      const selected = req.body;
      console.log(selected);
      const result = await selectedClassCollection.insertOne(selected);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Shippo Sports Academy is Running');
})

app.listen(port, ()=>{
    console.log(`Shippo Sports Academy is Running on port: ${port}`);
})