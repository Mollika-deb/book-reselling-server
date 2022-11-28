const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const jwt = require('jsonwebtoken');

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ineyp7q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const categoryCollection = client.db('BookSaler').collection('categories');
        const bookCollection = client.db('BookSaler').collection('Books');
        const orderCollection = client.db('BookSaler').collection('order');
        const usersCollection = client.db('BookSaler').collection('user');
        // const reviewCollection = client.db('tourBD').collection('reviews');


        app.get('/categories', async (req, res) => {
            const query = {};
            const coursor = categoryCollection.find(query);
            const categories = await coursor.toArray();
            res.send(categories);
        });
        
        
        // app.get('/allservices', async (req, res) => {
        //     const query = {};
        //     const coursor = serviceCollection.find(query);
        //     const services = await coursor.toArray();
        //     res.send(services);
        // });

        app.get('/jwt', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
                return res.send({accessToken: token})
            }
            console.log(user);
            res.status(403).send({ accessToken: ''})
        })


        app.get('/books', async (req, res) => {
            
           let query = {};
           if(req.query.id){
            query={
                id: req.query.id,
            };
           }
           const product = await bookCollection.find(query).toArray()
           res.send(product);
        });

        app.post('/order', async(req, res) =>{
            const orders = req.body;
            console.log(orders);
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        });
        app.get('/order', async(req, res) =>{
            const email = req.query.email;
            const query = {email:email};
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);

        });

        app.post('/users', async(req, res) =>{
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
          
        });
        

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.put('/users/admin/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    role:'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        




        // app.get('/reviews', async (req, res) => {

        //     let query = {};
        //     const email = req.query.email;
        //     if (email) {
        //         query = {
        //             email: email,
        //         }
        //     }
        //     const cursor = reviewCollection.find(query).sort({ timestamp: -1 });
        //     const reviews = await cursor.toArray();
        //     res.send(reviews)
        // })
        // app.delete('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await reviewCollection.deleteOne(query);
        //     res.send(result);

        // })


        // app.post('/reviews', async (req, res) => {
        //     const review = req.body;
        //     const result = await reviewCollection.insertOne(review);
        //     res.send(result);
        // });

        // app.post('/addService', async (req, res) => {
        //     const addService = req.body;
        //     const result = await addServiceCollection.insertOne(addService);
        //     res.send(result)
        // })

        // app.get('/addService', async (req, res) => {

        //     let query = {};
        //     const email = req.query.email;
        //     if (email) {
        //         query = {
        //             email: email,
        //         }
        //     }
        //     const cursor = addServiceCollection.find(query);
        //     const addService = await cursor.toArray();
        //     res.send(addService);
        // })
    }
    finally {

    }
}

run().catch(err => console.error(err))





app.get('/', (req, res) => {
    res.send('assignment 12')
});

app.listen(port, () => {
    console.log(`server is runing on ${port}`)
})