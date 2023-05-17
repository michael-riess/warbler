import { type User } from '@clerk/nextjs/server';

export const filterUserPropsForClient = (user: User) => ({
    id: user.id,
    username: user.username as string, // I know that it won't be null so lets just cast it to shut typescrtipt up
    profileImageUrl: user.profileImageUrl,
});
