import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fs from 'fs';
import path from 'path';

const server = Fastify({ logger: true });

// === CORS ===
// Autorise uniquement ton domaine et ses sous-domaines
const allowedOrigins = ['https://ton-domaine.com', 'https://*.ton-domaine.com'];
server.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // accès direct ou curl
    if (allowedOrigins.some(d => new RegExp(d.replace('*', '.*')).test(origin))) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed'), false);
    }
  }
});

// === Auto-chargement des routes ===
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
  const route = require(`./routes/${file}`);
  server.register(route, { prefix: `/api/${file.replace('.ts', '')}` });
});

// === Démarrage du serveur ===
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
