import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { ContextType } from "./context.js";

export const UserType = new GraphQLObjectType<User, ContextType>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileType,
      resolve: (obj, _args, context) => {
        return context.prisma.profile.findUnique({
          where: { userId: obj.id }
        })
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (obj, _args, context) => {
        return context.prisma.post.findMany({
          where: { authorId: obj.id }
        })
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (obj, _args, context) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: obj.id
              },
            },
          },
        })
      }
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (obj, _args, context) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: obj.id,
              },
            },
          },
        })
      }
    },
  }),
})

type User = {
  id: string,
  name: string,
  balance: number,
}
