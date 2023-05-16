import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { type RouterOutputs, api } from '~/utils/api';
import { useUser } from '@clerk/nextjs';
import { PageLoadingSpinner } from '~/components/loading-spinner';

dayjs.extend(relativeTime);

const PostCreateWizard = () => {
    const { user } = useUser();
    if (!user) return null;

    return (
        <div className="flex w-full gap-3 rounded-t-md bg-yellow-200 p-6">
            <input
                type="text"
                placeholder="What's happening?"
                className="grow bg-transparent text-slate-400 outline-none"
            />
        </div>
    );
};

const Post = (props: RouterOutputs['post']['getAll'][number]) => {
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

const Feed = () => {
    const { data, isLoading: arePostsLoading } = api.post.getAll.useQuery();
    if (arePostsLoading) return <PageLoadingSpinner />;
    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex flex-col border-t border-yellow-200">
            {data?.map((authorPost) => (
                <Post {...authorPost} key={authorPost.post.id} />
            ))}
        </div>
    );
};

const Home: NextPage = () => {
    const { isSignedIn, isLoaded: isUserLoaded } = useUser();

    // prefetch posts
    api.post.getAll.useQuery();

    if (!isUserLoaded) return <div />;

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen justify-center">
                <div className="w-full rounded-md border-x border-yellow-200 md:max-w-2xl">
                    {isSignedIn && <PostCreateWizard />}
                    <Feed />
                </div>
            </main>
        </>
    );
};

export default Home;
