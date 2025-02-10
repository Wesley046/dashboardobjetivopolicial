const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(express.json());

// Usuário de exemplo (isso será alterado quando usarmos banco de dados)
const users = [];

// Rota para registrar usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  users.push({ username, password: hashedPassword });
  res.status(201).send('Usuário registrado!');
});

// Rota para login (geração de token JWT)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (!user) return res.status(400).send('Usuário não encontrado');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Senha incorreta');
  
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Rota para dashboard (somente para usuários logados)
app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(403).send('Acesso negado');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    
    res.json({ message: `Bem-vindo ao seu dashboard, ${user.username}` });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
