import { PrismaClient } from "@prisma/client"

export type Context = {
  prisma: PrismaClient,
};

export type Args = {
  id: string,
};

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