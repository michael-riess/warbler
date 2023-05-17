import { type User } from '@clerk/nextjs/server';

export type RoutableUser = { username: string };

export type DisplayableAuthor = Pick<User, 'id' | 'profileImageUrl'> &
    RoutableUser;
