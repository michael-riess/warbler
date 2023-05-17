import { type User } from '@clerk/nextjs/server';

export const filterUserPropsForClient = (user: User) => ({
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
});
