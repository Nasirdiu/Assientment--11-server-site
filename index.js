const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");
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
      res.send(product);
    });
    //product get
    app.get("/product", async (req, res) => {
      const products = await useProduct.find({}).toArray();
      res.send(products);
    });
    app.delete("/product", async (req, res) => {
      id = req.body;
      const products = await useProduct.deleteOne(id);
      res.send(products);
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
