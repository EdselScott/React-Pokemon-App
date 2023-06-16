const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'Pokemons';

async function connectToMongo() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db(dbName);
    console.log('Connected to MongoDB');

    app.post('/api/v1/Pokemons', async (req, res) => {
      try {
        const collection = db.collection('Pokemons');
        const newPokemon = req.body;
        await collection.insertOne(newPokemon);
        res.send('Pokemon added successfully!');
      } catch (error) {
        console.error('Error adding pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/api/v1/Pokemons', async (req, res) => {
      try {
        const collection = db.collection('Pokemons');
        const limit = parseInt(req.query.limit) || 0;
        const offset = parseInt(req.query.offset) || 0;
        const result = await collection.find().skip(offset).limit(limit).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/api/v1/Pokemons/:name', async (req, res) => {
      try {
        const collection = db.collection('pokemons');
        const pokemon = await collection.findOne({ name: req.params.name });
        if (pokemon) {
          res.send(pokemon);
        } else {
          res.status(404).send('Pokemon not found');
        }
      } catch (error) {
        console.error('Error fetching pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.put('/api/v1/Pokemons/:name', async (req, res) => {
      try {
        const collection = db.collection('Pokemons');
        const result = await collection.updateOne(
          { name: req.params.name },
          { $set: req.body }
        );
        if (result.modifiedCount === 1) {
          res.send('Pokemon updated successfully!');
        } else {
          res.status(404).send('Pokemon not found');
        }
      } catch (error) {
        console.error('Error updating pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/api/v1/Pokemons/:name', async (req, res) => {
      try {
        const collection = db.collection('Pokemons');
        const result = await collection.deleteOne({ name: req.params.name });
        if (result.deletedCount === 1) {
          res.send('Pokemon deleted successfully!');
        } else {
          res.status(404).send('Pokemon not found');
        }
      } catch (error) {
        console.error('Error deleting pokemon:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.listen(port, () => {
      console.log(`Pokemon API listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongo();
