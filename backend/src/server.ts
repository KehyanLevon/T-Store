import app from './app';
import config from './config/config';
import { testDbConnection } from './config/db';

(async () => {
  await testDbConnection();
})();

app.listen(config.port, () => {
  console.log(`Server: http://localhost:${config.port}`);
});
