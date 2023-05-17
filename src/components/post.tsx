import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';

import { type RouterOutputs } from '~/utils/api';
import { getUserAtTag } from '~/utils/user';

dayjs.extend(relativeTime);

export const Post = (props: RouterOutputs['post']['getAll'][number]) => {
    const { post, author } = props;
    const authorAtTag = getUserAtTag(author);
    return (
        <div
            key={post.id}
            className="flex gap-4 border-b border-yellow-200 p-4"
        >
            <Image
                className="h-12 w-12 rounded-full"
                src={author.profileImageUrl}
                alt={`${authorAtTag}'s profile picture`}
                width={50}
                height={50}
            />
            <div className="flex flex-col">
                <span>
                    <Link href={`/${authorAtTag}`}>
                        <span className="cursor-pointer text-slate-400 hover:text-sky-400">
                            {authorAtTag}
                        </span>
                    </Link>
                    <Link href={`/post/${post.id}`}>
                        <span className="font-thin hover:hover:text-sky-400">
                            {` • ${dayjs(post.createdAt).fromNow()}`}
                        </span>
                    </Link>
                </span>
                {post.content}
            </div>
        </div>
    );
};
