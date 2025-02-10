const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: 'SUA_CONNECTION_STRING_DO_RENDER', // Substitua pela sua connection string
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Usuário não encontrado' });
        }

        // Compara a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Senha incorreta' });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: usuario.id }, 'secreto', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});