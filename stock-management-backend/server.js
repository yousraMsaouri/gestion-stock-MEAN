const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialisation Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/stock_management')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB :', err));

/// === Modèles === ///
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'user' }
}));

const Stock = mongoose.model('Stock', new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
}));

const Movement = mongoose.model('Movement', new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    type: { type: String, enum: ['entrée', 'sortie'] },
    quantity: Number,
    date: { type: Date, default: Date.now }
}));

/// === Middleware JWT === ///
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('⛔ Token manquant');

    jwt.verify(token, 'SECRET_KEY', (err, user) => {
        if (err) return res.status(403).send('⛔ Token invalide');
        req.user = user;
        next();
    });
}

/// === Authentification === ///
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).send("⚠️ Utilisateur déjà existant");

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();
    res.status(201).send("✅ Inscription réussie !");
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("❌ Utilisateur non trouvé");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("❌ Mot de passe incorrect");

    const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
    res.send({ token });
});

/// === Routes Produits === ///
app.get('/api/products', authenticateToken, async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.post('/api/products', authenticateToken, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).send("❌ Produit non trouvé");
    res.send(product);
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("❌ Produit non trouvé");
    res.send("✅ Produit supprimé");
});

/// === Routes Stocks === ///
app.get('/api/stocks', authenticateToken, async (req, res) => {
    const stocks = await Stock.find().populate('productId');
    res.send(stocks);
});

app.post('/api/stocks', authenticateToken, async (req, res) => {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).send(stock);
});

app.put('/api/stocks/:id', authenticateToken, async (req, res) => {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stock) return res.status(404).send("❌ Stock non trouvé");
    res.send(stock);
});

app.delete('/api/stocks/:id', authenticateToken, async (req, res) => {
    const deleted = await Stock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("❌ Stock non trouvé");
    res.send("✅ Stock supprimé");
});

/// === Routes Mouvements === ///
app.get('/api/movements', authenticateToken, async (req, res) => {
    const movements = await Movement.find().populate('productId');
    res.send(movements);
});

app.post('/api/movements', authenticateToken, async (req, res) => {
    const movement = new Movement(req.body);
    await movement.save();
    res.status(201).send(movement);
});

app.put('/api/movements/:id', authenticateToken, async (req, res) => {
    const movement = await Movement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movement) return res.status(404).send("❌ Mouvement non trouvé");
    res.send(movement);
});

app.delete('/api/movements/:id', authenticateToken, async (req, res) => {
    const deleted = await Movement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("❌ Mouvement non trouvé");
    res.send("✅ Mouvement supprimé");
});

/// === Lancer le serveur === ///
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});
