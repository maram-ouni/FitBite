const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const recettesRoutes = require('./routes/recettesRoutes');
const favorisRoutes = require('./routes/favorisRoutes');
const formulaireDynamiqueRoutes = require('./routes/formulaireDynamiqueRoutes');
const ingredientsRoutes = require('./routes/ingredientsRoutes');
const listeCoursesRoutes = require('./routes/listeCoursesRoutes');
const supermarchesRoutes = require('./routes/supermarchesRoutes');
const utilisateursRoutes = require('./routes/utilisateursRoutes');
const mealRoutes = require("./routes/MealRoutes");


dotenv.config();
const app = express();

// Configurer CORS pour permettre les requêtes provenant de localhost:8081
const corsOptions = {
  origin: ['http://localhost:8081', 'exp://192.168.1.144:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions)); // Appliquez la politique CORS

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Fitbite',
      version: '1.0.0',
      description: 'API pour gérer les utilisateurs, les recettes et les favoris',
    },
  },
  apis: ['./routes/*.js'], // Rechercher les annotations Swagger dans les fichiers de routes
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recettes', recettesRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/formulaireDynamique', formulaireDynamiqueRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/listeCourse', listeCoursesRoutes);
app.use('/api/supermarches', supermarchesRoutes);
app.use('/api/utilisateurs', utilisateursRoutes);
app.use("/api", mealRoutes);





app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));


