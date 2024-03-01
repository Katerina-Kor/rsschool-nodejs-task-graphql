import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./types/uuid.js";
import { ContextType } from "./types/context.js";
import { UserType } from "./types/user.js";
import { ArgsType } from "./types/args.js";
import { PostType } from "./types/post.js";

export const rootQueryType = new GraphQLObjectType<unknown, ContextType>({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: (_obj, _args, context) => context.prisma.user.findMany(),
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obg, { id }: ArgsType, context) => {
        return await context.prisma.user.findUnique({
          where: { id },
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (_obj, _args, context) => context.prisma.post.findMany(),
    },

    post: {
      type: PostType,
      resolve: async (_obj, { id }: ArgsType, context) => {
        return await context.prisma.post.findUnique({
          where: { id }
        })
      }
    }
  }
});
