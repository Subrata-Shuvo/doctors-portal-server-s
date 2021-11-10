const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvuud.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
      try{
          await client.connect();
          const database = client.db('doctors_portal');
          const appointmentsCollection = database.collection('appointments');
          const usersCollection = database.collection('users');

          // GET API
         app.get('/appointments', async(req, res) => {
           const email = req.query.email;
           const date = req.query.date;
           
           const query = {email: email, date: date};
           
           const cursor = appointmentsCollection.find(query);
           const appointments = await cursor.toArray();
           res.json(appointments);
         })
          // POST API APPOINTMENT
          app.post('/appointments', async(req, res) =>{
              const appointment = req.body;
              const result = await appointmentsCollection.insertOne(appointment);
              res.send(result)
          });

          // POST API USER
          app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
          })

          // PUT API
          app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email : user.email};
            const options = {upsert : true};
            const updateDoc = {$set : user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
          })

      }
      finally{
       // await client.close();
      }
}

run().catch(console.dir);




















app.get('/', (req, res) => {
  res.send('My Doctors Portal')
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})





/*
app.get('/users')
          app.post('/users')
          app.get('/users/:id')
          app.put('/users/:id')
          app.delete('/users/:id')
         
         
          // users: get
          // users: post 
          // users: put
          // users: delete */