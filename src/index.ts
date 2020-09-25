import { app } from './app';
import { AppConfig } from './config';
import { logger } from './logging/logger';

const { PORT } = AppConfig;

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});
