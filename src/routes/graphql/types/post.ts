import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Post } from "@prisma/client";

export const PostType = new GraphQLObjectType<Post>({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString},
    authorId: { type: UUIDType },
  }),
});

export const CreatePostBodyType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString},
    authorId: { type: UUIDType },
  },
});

export const ChangePostBodyType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString},
  },
});