import * as url from 'node:url';
import express from 'express';
import {z} from 'zod';
import cors from "cors";

export const app = express();

app.use(cors());
app.get('/', (_, res) => {
  res.send('Hello World!');
});

/**
 * Is this script file the main module or imported?
 */
function isMain(): boolean {
  if (!import.meta.url.startsWith('file:')) {
    return false;
  }

  const modulePath = url.fileURLToPath(import.meta.url);
  return process.argv[1] === modulePath;
}

if (isMain()) {
  console.log('Server listening at http://localhost:3000');
  app.listen(3000);
}
