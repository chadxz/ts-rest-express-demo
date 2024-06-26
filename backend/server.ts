import express, {type NextFunction, type Request, type Response} from 'express';
import cors from "cors";
import {isMain} from "./isMain";
import {createExpressEndpoints, initServer} from '@ts-rest/express';
import bodyParser from "body-parser";
import {contract} from "../shared/contract";
import {generateOpenApi} from "@ts-rest/open-api";
import packageJson from "../package.json";
import swaggerUi from 'swagger-ui-express';

export const app = express();

app.use(cors());
app.use(bodyParser.json());

const router = initServer().router(contract, {
  getUser: async () => {
    return {
      status: 200,
      body: {
        id: 1,
        name: 'Bilbo Baggins',
        email: 'bilbo@shire.lotr'
      }
    };
  },
  createUser: async () => {
    throw new Error('something bad happened');
  },
});

createExpressEndpoints(contract, router, app);

const openAPIDocument = generateOpenApi(contract, {
  info: {
    title: packageJson.name,
    version: '1.0.0',
  },
});

app.get("/openapi.json", (_, res) => {
  res.status(200).json(openAPIDocument);
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openAPIDocument));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    res.status(500).send({ message: err.message});
    return;
  }

  res.status(500).send({ message: 'Internal Server Error' });
})

if (isMain(import.meta.url)) {
  console.log('Server listening at http://localhost:3000');
  app.listen(3000);
}
