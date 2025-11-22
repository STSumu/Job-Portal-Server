const express=require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnmongo.4ifovjo.mongodb.net/?appName=LearnMongo`;


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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const jobCollection=client.db('Job-Portal').collection('jobs');
    const jobApplicationCollection=client.db('Job-Portal').collection('jobApplications');

    app.get('/jobs',async(req,res)=>{
        const jobs=jobCollection.find();
        const result=await jobs.toArray();
        res.send(result);
    })
    app.get('/jobs/:id',async(req,res)=>{
      const query=new ObjectId(req.params.id);
      const result=await jobCollection.findOne(query);
      res.send(result);
    });
    app.get('/application',async(req,res)=>{
      const email=req.query.email;
      const query={applicantEmail:email};
      const result=await jobApplicationCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/jobApply',async(req,res)=>{
      const application=req.body;
      const result=await jobApplicationCollection.insertOne(application);
      res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Job Portal is running');
})
app.listen(port,()=>{
    console.log('Job Portal server is Onair');
})