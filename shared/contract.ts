import { initContract } from '@ts-rest/core';
import {z} from "zod";
import {extendZodWithOpenApi} from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

const ErrorSchema = z.object({
  message: z.string().min(1),
})

const UserSchema = z.object({
  id: z.number().gt(0).openapi({
    description: "The id of the user",
  }),
  name: z.string().openapi({
    description: "The name of the user",
    example: "Bilbo Baggins",
  }),
  email: z.string().email().openapi({
    description: "The user's email address",
    example: "bilbo@shire.lotr"
  })
});

export const contract = initContract().router({
   getUser: {
     method: 'GET',
     path: '/users/:id',
     pathParams: z.object({
       id: z.coerce.number().gt(0).openapi({
         description: "The id of the user to lookup",
       }),
     }),
     responses: {
       200: UserSchema,
       404: ErrorSchema,
     },
     summary: "Lookup a user by it's id",
   },
  createUser: {
    method: 'POST',
    path: '/users',
    body: UserSchema.omit({ id: true }),
    responses: {
      201: UserSchema,
      400: ErrorSchema,
    },
    summary: "Create a new user",
  }
}, {
  pathPrefix: '/api',
  strictStatusCodes: true,
  commonResponses: {
    500: z.object({
      message: z.string(),
    })
  }
});
