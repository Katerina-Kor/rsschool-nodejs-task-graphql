import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { FieldNode, GraphQLSchema, graphql, parse, validate } from 'graphql';
import { rootQueryType } from './query.js';
import { Context, DLKeys } from './types/types.js';
import { rootMutationType } from './mutation.js';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';

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

      const context: Context = {
        prisma,
        dataLoaders: new Map<DLKeys, any>()
      };

      const graphQLErrors = validate(schema, parse(query), [depthLimit(5)]);
      if (graphQLErrors.length > 0) {
        return { errors: graphQLErrors };
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
  mutation: rootMutationType,
})

export default plugin;
