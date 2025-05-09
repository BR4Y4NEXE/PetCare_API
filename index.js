require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const FIREBASE_URL = process.env.FIREBASE_URL;

// Ruta para recibir datos del DHT11
app.post("/api/dht11", async (req, res) => {
  const { temperatura, humedad, timestamp } = req.body;

  if (!temperatura || !humedad || !timestamp) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const response = await axios.put(`${FIREBASE_URL}/lecturas/dht11.json`, {
      temperatura,
      humedad,
      timestamp
    });
    res.status(200).json({ message: "DHT11 enviado", firebaseResponse: response.data });
  } catch (err) {
    res.status(500).json({ error: "Error enviando a Firebase" });
  }
});

// Ruta para el sensor infrarrojo
app.post("/api/sensor-ir", async (req, res) => {
  const { disponible, timestamp } = req.body;

  if (disponible === undefined || !timestamp) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const response = await axios.put(`${FIREBASE_URL}/lecturas/sensor_ir.json`, {
      disponible,
      timestamp
    });
    res.status(200).json({ message: "Sensor IR enviado", firebaseResponse: response.data });
  } catch (err) {
    res.status(500).json({ error: "Error enviando a Firebase" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
