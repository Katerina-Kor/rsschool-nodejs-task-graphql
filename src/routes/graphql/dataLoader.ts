import DataLoader, { BatchLoadFn } from "dataloader";
import { DLKeys, Profile, Post, Member, User } from "./types/types.js";
import { PrismaClient } from "@prisma/client";

type dataLoadersType = Map<DLKeys, DataLoader<string, Profile | Post[] | Member | User[] | undefined, string>>;

const dataLoaders: dataLoadersType = new Map();

export const getProfileLoader = (db: PrismaClient) => {
  // let dl = dataLoaders.get('profile');
  // if (!dl) {
    const batchFuncProfile: BatchLoadFn<string, Profile | undefined> = async (ids) => {

      const profiles: Profile[] = await db.profile.findMany({
        where: {
          userId: {
            in: ids as string[]
          }
        }
      });
    
      return ids.map(id => profiles.find((profile) => profile.userId === id));
    };
    
    // dl = new DataLoader<string, Profile | undefined>(batchFuncProfile);
    return new DataLoader<string, Profile | undefined>(batchFuncProfile);
  //   dataLoaders.set('profile', dl);
  // }
  // return dl;
};

export const getPostsLoader = (db: PrismaClient) => {
  // let dl = dataLoaders.get('posts');
  // if (!dl) {
    const batchFunc: BatchLoadFn<string, Post[] | undefined> = async (ids) => {

      const posts = await db.post.findMany({
        where: {
          authorId: {
            in: ids as string[]
          }
        }
      });
  
      const sortedPosts = ids.map(id => posts.filter((post) => post.authorId === id));
      return sortedPosts;
    }
  
    // dl = new DataLoader<string, Post[] | undefined>(batchFunc);
    return new DataLoader<string, Post[] | undefined>(batchFunc);
  //   dataLoaders.set('posts', dl);
  // };
  
  // return dl;
};

export const getMemberLoader = (db: PrismaClient) => {
  // let dl = dataLoaders.get('memberType');
  // if (!dl) {
    const batchFunc: BatchLoadFn<string, Member | undefined> = async (ids) => {

      const memberTypes = await db.memberType.findMany({
        where: {
          id: {
            in: ids as string[]
          }
        }
      }) as Member[];
  
      const sortedMemberTypes = ids.map(id => memberTypes.find(memberType => memberType.id === id));
      return sortedMemberTypes;
    }
  
    // dl = new DataLoader<string, Member | undefined>(batchFunc);
    return new DataLoader<string, Member | undefined>(batchFunc);
  //   dataLoaders.set('memberType', dl);
  // }
  //   return dl;
};

export const getUserSubscribedToLoader = (db: PrismaClient) => {
  // let dl = dataLoaders.get('userSubscribedTo');
  // if (!dl) {
    const batchFunc: BatchLoadFn<string, User[] | undefined> = async (ids) => {
      const users = await db.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: {
                in: ids as string[]
              },
            },
          },
        },
        include: {
          subscribedToUser: true
        },
      });
  
      const sortedUsers = ids.map(id => 
        users.filter(user => 
          user.subscribedToUser.find(subscribedUser => 
            subscribedUser.subscriberId === id) ));
  
      return sortedUsers;
    }
  
    // dl = new DataLoader<string, User[] | undefined>(batchFunc);
    return new DataLoader<string, User[] | undefined>(batchFunc);
  //   dataLoaders.set('userSubscribedTo', dl);
  // }
  
  // return dl;
};

export const getSubscribedToUserLoader = (db: PrismaClient) => {
  // let dl = dataLoaders.get('subscribedToUser');
  // if (!dl) {
    const batchFunc: BatchLoadFn<string, User[] | undefined> = async (ids) => {

      const users = await db.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: {
                in: ids as string[]
              }
            }
          }
        },
        include: {
          userSubscribedTo: true
        }
      });
  
      const sortedUsers = ids.map(id => 
        users.filter(user => 
          user.userSubscribedTo.find(subUser => 
            subUser.authorId === id)));
  
      return sortedUsers;
    }
  
    // dl = new DataLoader<string, User[] | undefined>(batchFunc);
    return new DataLoader<string, User[] | undefined>(batchFunc);
  //   dataLoaders.set('subscribedToUser', dl);
  // }
  
  // return dl;
};
