import { useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';

import { Feed } from '~/components/feed';
import { PageTemplate } from '~/components/page-template';
import { PostCreateWizard } from '~/components/post-create-wizard';
import { api } from '~/utils/api';

const HomePage: NextPage = () => {
    const { isSignedIn, isLoaded: isUserLoaded } = useUser();

    // prefetch posts
    api.post.getAll.useQuery();

    if (!isUserLoaded) return <div />;

    return (
        <>
            <PageTemplate>
                {isSignedIn && <PostCreateWizard isSticky={true} />}
                <Feed />
            </PageTemplate>
        </>
    );
};

export default HomePage;
