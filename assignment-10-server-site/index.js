const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9byz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);
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
   
    const campaignCollection = client.db("campaignDB").collection('campaign');
    const donatedCollection = client.db("campaignDB").collection('donatedCollection');
    const userCollection = client.db("campaignDB").collection('users');

    app.get('/campaign', async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.post('/campaign', async (req, res) => {
      const addCampaign = req.body;
      console.log(addCampaign);


      const result = await campaignCollection.insertOne(addCampaign);
      res.send(result);
  })

  app.get('/campaign/:id', async (req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await campaignCollection.findOne(query)
    res.send(result)
})

app.put('/campaign/:id', async (req, res) => {
  const id = req.params.id
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const editedCampaign = req.body;
  const campaign = {
      $set: {
          deadline: editedCampaign.deadline,
          type: editedCampaign.type,
          description: editedCampaign.description,
          minDonation: editedCampaign.minDonation,
          thumbnail: editedCampaign.thumbnail,
          title: editedCampaign.title

      }

  }

  const result = await campaignCollection.updateOne(filter, campaign, options)
  res.send(result)
})



  app.delete('/campaign/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) }
    const result = await campaignCollection.deleteOne(query);
    res.send(result)
})


// donated collection

app.post('/donatedCollection', async (req, res) => {
  const donatorData = req.body;


  const result = await donatedCollection.insertOne(donatorData);
  res.send(result);
})

app.get('/donatedCollection', async (req, res) => {
  const cursor = donatedCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// users Collection

app.get('/users', async (req, res) => {
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.post('/users', async (req, res) => {
  const usersData = req.body;


  const result = await userCollection.insertOne(usersData);
  res.send(result);
})



    // Send a ping to confirm a successful connection
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`Crowdfunding server is running on: ${port} `);
})