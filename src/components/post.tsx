import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

import { type RouterOutputs } from '~/utils/api';

dayjs.extend(relativeTime);

export const Post = (props: RouterOutputs['post']['getAll'][number]) => {
    const { post, author } = props;
    return (
        <div
            key={post.id}
            className="flex gap-4 border-b border-yellow-200 p-4"
        >
            <Image
                className="h-12 w-12 rounded-full"
                src={author.profileImageUrl}
                alt={`@${author.username}'s profile picture`}
                width={50}
                height={50}
            />
            <div className="flex flex-col">
                <span>
                    {/* TODO: Add real link to authors page */}
                    <span className="cursor-pointer text-slate-400 hover:text-sky-400">{`@${author.username}`}</span>
                    <span className="font-thin">
                        {` • ${dayjs(post.createdAt).fromNow()}`}
                    </span>
                </span>
                {post.content}
            </div>
        </div>
    );
};
