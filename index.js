const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//middleware
app.use(cors());
app.use(express.json());
//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tfb5c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const useProduct = client.db("electronics").collection("product");

    //product uploaded
    app.post("/uploadPd", async (req, res) => {
      const product = req.body;
      const products = await useProduct.insertOne(product);
      res.send(products);
    });
    //product get
    app.get("/product", async (req, res) => {
      const products = await useProduct.find({}).toArray();
      res.send(products);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const querry = { _id: ObjectId(id) };
      const result = await useProduct.findOne(querry);
      res.send(result);
    });
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await useProduct.deleteOne(query);
      res.send(products);
    });

    //update
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const oldQuantity = parseInt(req.query.oldQuantity);
      console.log(oldQuantity);
      const uUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const uDoc = {
        $set: {
          quantity: parseInt(uUser.quantity) + parseInt(oldQuantity),
        },
      };
      const result = await useProduct.updateOne(filter, uDoc, options);
      res.send(result);
    });

    //decrising one by one

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const oldQuantity = parseInt(req.query.oldQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const uDoc = {
        $set: {
          quantity: parseInt(oldQuantity) - 1,
        },
      };
      const result = await useProduct.updateOne(filter, uDoc, options);
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.listen(port, () => {
  console.log("CRUD Is Running", port);
});
