import { PrismaClient } from "@prisma/client"
import DataLoader from "dataloader";
import { FieldNode } from "graphql";

export type Context = {
  prisma: PrismaClient,
  dataLoaders: {
    [key: string]: any
  }
};

export type Args = {
  id: string,
};

export type CreateUserArgs = {
  dto: Omit<User, 'id'>,
};

export type CreatePostArgs = {
  dto: Omit<Post, 'id'>,
};

export type CreateProfileArgs = {
  dto: Omit<Profile, 'id'>,
};

export type SubscribeArgs = {
  userId: string,
  authorId: string,
}

export type User = {
  id: string,
  name: string,
  balance: number,
};

export type Profile = {
  id: string,
  isMale: boolean,
  yearOfBirth: number,
  userId: string,
  memberTypeId: string,
};

export type Post = {
  id: string,
  title: string,
  content: string,
  authorId: string,
};

export type Member = {
  id: 'basic' | 'business',
  discount: number,
  postsLimitPerMonth: number,
};

export type RootObject = User | Profile | Post | Member;