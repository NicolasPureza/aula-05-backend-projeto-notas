const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, "data.json");

// Permite receber JSON no corpo das requisições
app.use(bodyParser.json());

// Libera acesso externo (CORS) para métodos CRUD
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

function readNotes() {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2), "utf8");
}

app.get("/", (req, res) => {
  res.json({ status: "API de Notas funcionando!", endpoints: ["/api/notes"] });
});

// GET - Listar todas as notas
app.get("/api/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// GET - Obter nota por ID
app.get("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const nota = notes.find((n) => n.id === req.params.id);
  if (!nota) {
    return res.status(404).json({ erro: "Nota não encontrada" });
  }
  res.json(nota);
});

// POST - Criar nova nota
app.post("/api/notes", (req, res) => {
  const { titulo, texto } = req.body || {};
  if (!titulo || !texto) {
    return res.status(400).json({ erro: "Os campos titulo e texto são obrigatórios." });
  }

  const notes = readNotes();
  const novaNota = {
    id: Date.now().toString(),
    titulo: String(titulo).trim(),
    texto: String(texto).trim(),
    criadoEm: new Date().toISOString(),
  };

  notes.push(novaNota);
  saveNotes(notes);
  res.status(201).json(novaNota);
});

// PUT - Atualizar nota existente
app.put("/api/notes/:id", (req, res) => {
  const { titulo, texto } = req.body || {};
  if (!titulo || !texto) {
    return res.status(400).json({ erro: "Os campos titulo e texto são obrigatórios." });
  }

  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === req.params.id);

  if (index >= 0) {
    notes[index].titulo = String(titulo).trim();
    notes[index].texto = String(texto).trim();
    saveNotes(notes);
    res.json(notes[index]);
  } else {
    res.status(404).json({ erro: "Nota não encontrada" });
  }
});

// DELETE - Excluir nota
app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const existe = notes.some((n) => n.id === req.params.id);

  if (!existe) {
    return res.status(404).json({ erro: "Nota não encontrada" });
  }

  const novasNotas = notes.filter((n) => n.id !== req.params.id);
  saveNotes(novasNotas);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
