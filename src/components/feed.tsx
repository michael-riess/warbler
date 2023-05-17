import { PageLoadingSpinner } from '~/components/loading-spinner';
import { Post } from '~/components/post';
import { api } from '~/utils/api';

export const Feed = ({ authorId }: { authorId?: string }) => {
    const { data, isLoading: arePostsLoading } = api.post.getAll.useQuery({
        authorId,
    });
    if (arePostsLoading) return <PageLoadingSpinner />;
    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex flex-col border-t border-yellow-200 overscroll-contain">
            {data?.map((authorPost) => (
                <Post {...authorPost} key={authorPost.post.id} />
            ))}
        </div>
    );
};
