import { sequelize } from './models/index.js';

sequelize.sync({ alter: true })
  .then(() => console.log("✅ Synced DB."))
  .catch(err => console.error("❌ DB sync error:", err));
