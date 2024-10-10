const express = require('express');
const fs = require('fs');
const path = require('path');  // Importar el módulo 'path' para manejar rutas
const cors = require('cors');  // Importar cors

const app = express();
const PORT = 22333;

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
app.get('/api/hola', function(req, res) {
  const { spawn } = require('child_process');

  console.log("Inicio del proceso");

  const pythonProcess = spawn('python', ['./server.py', 'text', '4']);
  let pythonOutput = '';
  pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();  
      console.log('[Mensaje recibido desde Python:] ', pythonOutput.trim(), "  [end message]");
  });
  pythonProcess.on('close', (code) => {
      console.log(`El proceso de Python se cerró con el código ${code}`);
      if (code === 0) {
          res.json({ message: pythonOutput.trim() });
      } else {
          res.status(500).json({ error: 'El script de Python no se ejecutó correctamente.' });
      }
  });
  pythonProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString().trim();
      console.error('Error en el proceso de Python:', errorMessage);
      res.status(500).json({ error: errorMessage }); // Enviar el error al cliente
  });
});



// Ruta GET: Obtener una pregunta por ID
app.get('/preguntas/:id', (req, res) => {
  const pregunta = preguntas.find(p => p.id === parseInt(req.params.id));
  if (!pregunta) return res.status(404).send('Pregunta no encontrada');
  res.json(pregunta);
});



app.post('/api/preguntes', function (req, res) {
    const filePath = path.join(__dirname, 'preguntas.json'); 
    const nuevaPregunta = req.body; 
    if (!nuevaPregunta || !nuevaPregunta.pregunta || !nuevaPregunta.respostes || !nuevaPregunta.resposta_correcta || !nuevaPregunta.imatge) {
        return res.status(400).send({ message: 'Faltan datos para la nueva pregunta' });
    }
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo' });
        }
        const json = JSON.parse(data);
        const nuevoId = json.preguntes.length > 0 ? Math.max(...json.preguntes.map(p => p.id)) + 1 : 1;
        nuevaPregunta.id = nuevoId;
        nuevaPregunta.respostes.forEach((resposta, index) => {
            resposta.id = index + 1;
        });
        json.preguntes.push(nuevaPregunta);
        fs.writeFile(filePath, JSON.stringify(json, null, 2), function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar la nueva pregunta' });
            }
            res.send({ message: 'Pregunta agregada', pregunta: nuevaPregunta }); // Responder con éxito
        });
    });
});


// Ruta PUT: Actualizar una pregunta existente
app.put('/api/preguntes/:id', function(req, res) {
    const id = parseInt(req.params.id); // Obtener el ID de la pregunta que se va a editar
    const filePath = path.join(__dirname, 'preguntas.json'); // Ruta al archivo JSON
  
    // Verifica si req.body tiene datos
    console.log('Datos recibidos:', req.body);
  
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) return res.status(500).send({ message: 'Error al leer el archivo' });
  
      const json = JSON.parse(data); // Parsear el archivo JSON
      const index = json.preguntes.findIndex(p => p.id === id); // Buscar la pregunta por ID
  
      if (index !== -1) {
        // Actualizar los datos de la pregunta con los datos del cuerpo de la solicitud
        const preguntaEditada = req.body; // Los nuevos datos de la pregunta (se asume que vienen en el cuerpo)
        json.preguntes[index] = { ...json.preguntes[index], ...preguntaEditada }; // Fusionar los datos existentes con los nuevos
  
        // Verifica los datos antes de guardar
        console.log('Datos actualizados:', json.preguntes[index]);
  
        // Guardar el archivo actualizado
        fs.writeFile(filePath, JSON.stringify(json, null, 2), function(err) {
          if (err) return res.status(500).send({ message: 'Error al guardar el archivo' });
          res.send({ message: 'Pregunta actualizada' }); // Responder con éxito
        });
      } else {
        res.status(404).send({ message: 'Pregunta no encontrada' }); // Si no se encuentra la pregunta
      }
    });
  });
  

// Ruta DELETE: Eliminar una pregunta por ID
app.delete('/api/preguntes/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const filePath = path.join(__dirname, 'preguntas.json');

    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) return res.status(500).send({ message: 'Error al leer el archivo' });

        const json = JSON.parse(data);
        const index = json.preguntes.findIndex(p => p.id === id);

        if (index !== -1) {
            json.preguntes.splice(index, 1); // Elimina la pregunta
            fs.writeFile(filePath, JSON.stringify(json, null, 2), function(err) {
                if (err) return res.status(500).send({ message: 'Error al guardar el archivo' });
                res.send({ message: 'Pregunta eliminada' }); // Responde con éxito
            });
        } else {
            res.status(404).send({ message: 'Pregunta no encontrada' });
        }
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://a23nicposrod.dam.inspedralbes.cat:${PORT}`);

});
