const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    const usersCollection = client.db("Shippo-Sports").collection("users")
    const popularClassesCollection = client.db("Shippo-Sports").collection("popularClasses")
    const popularInstructorsCollection = client.db("Shippo-Sports").collection("popularInstructors")
    const instructorsCollection = client.db("Shippo-Sports").collection("instructors")
    const classesCollection = client.db("Shippo-Sports").collection("classes")
    const selectedClassCollection = client.db("Shippo-Sports").collection("selected")


    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);
      console.log('existing User: ', existingUser);
      if (existingUser) {
        return res.send({ message: 'User already exists' })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })



    app.get('/popularClasses', async (req, res) => {
      const result = await popularClassesCollection.find().toArray();
      res.send(result);
    })

    app.get('/popularInstructors', async (req, res) => {
      const result = await popularInstructorsCollection.find().toArray();
      res.send(result);
    })

    app.get('/instructors', async (req, res) => {
      const result = await instructorsCollection.find().toArray();
      res.send(result);
    })

    app.get('/classes', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    // class related api 
    app.get('/select', async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await selectedClassCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/select', async (req, res) => {
      const selected = req.body;
      console.log(selected);
      const result = await selectedClassCollection.insertOne(selected);
      res.send(result);
    })

    app.delete('/select/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await selectedClassCollection.deleteOne(query);
      res.send(result);
    })


    app.path('users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
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




app.get('/', (req, res) => {
  res.send('Shippo Sports Academy is Running');
})

app.listen(port, () => {
  console.log(`Shippo Sports Academy is Running on port: ${port}`);
})