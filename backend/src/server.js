import 'dotenv/config';
import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
