import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { rootQueryType } from './query.js';
import { ContextType } from './types/context.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const context: ContextType = {
        prisma
      }

      return await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });
    },
  });
};

export const schema = new GraphQLSchema({
  query: rootQueryType,
})

export default plugin;
