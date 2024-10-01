const express = require('express');
const fs = require('fs');
const path = require('path');  // Importar el módulo 'path' para manejar rutas
const cors = require('cors');  // Importar cors

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: '*',  // Permitir todas las orígenes (puedes restringirlo si es necesario)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permitir estos métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization']  // Permitir estos headers
}));
app.use(express.json()); // Para parsear JSON

// Ruta para obtener todas las preguntas
app.get('/api/preguntes', function(req, res) {
    const filePath = path.join(__dirname, 'preguntas.json'); // Usar path.join para asegurar la ruta correcta
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error(err);  // Imprimir el error en la consola
            return res.status(500).send({ message: 'Error al leer el archivo' });
        }
        res.send(JSON.parse(data).preguntes);
    });
});



// Ruta GET: Obtener una pregunta por ID
app.get('/preguntas/:id', (req, res) => {
  const pregunta = preguntas.find(p => p.id === parseInt(req.params.id));
  if (!pregunta) return res.status(404).send('Pregunta no encontrada');
  res.json(pregunta);
});

// Ruta POST: Crear una nueva pregunta
app.post('/preguntas', (req, res) => {
  const nuevaPregunta = {
    id: preguntas.length + 1,
    pregunta: req.body.pregunta,
    imagen: req.body.imagen,
    respostes: req.body.respostes,
    resposta_correcta: req.body.resposta_correcta
  };
  preguntas.push(nuevaPregunta);
  res.status(201).json(nuevaPregunta);
});

// Ruta PUT: Actualizar una pregunta existente
app.put('/preguntas/:id', (req, res) => {
  const pregunta = preguntas.find(p => p.id === parseInt(req.params.id));
  if (!pregunta) return res.status(404).send('Pregunta no encontrada');

  pregunta.pregunta = req.body.pregunta;
  pregunta.imagen = req.body.imagen;
  pregunta.respostes = req.body.respostes;
  pregunta.resposta_correcta = req.body.resposta_correcta;

  res.json(pregunta);
});

// Ruta DELETE: Eliminar una pregunta por ID
app.delete('/api/preguntes/:id', (req, res) => {
  const idPregunta = parseInt(req.params.id);

  // Leer el archivo JSON
  fs.readFile('preguntas.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer el archivo' });

      const json = JSON.parse(data);
      const index = json.preguntes.findIndex(p=> p.id === id);

      if(index != -1){
        json.preguntes.splice(index, 1);
        fs.writeFile(filePath, JSON.stringify(json, null, 2), function(err){
          if (err) return res.status(500).send({message: 'Error al guardar archivo'});
          res.send({ message: 'Pregunta eliminada'})
        });
        
      }else{
        res.status(404).send({ message: 'Pregunta no encontrada'})
      }
    });
  });


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
