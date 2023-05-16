import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

import { api } from '~/utils/api';

export const PostCreateWizard = () => {
    const ctx = api.useContext();

    const [value, setValue] = useState('');
    const { mutate, isLoading } = api.post.create.useMutation({
        onSuccess: async () => {
            setValue('');
            await ctx.post.getAll.invalidate();
        },
    });

    const { user } = useUser();
    if (!user) return null;

    return (
        <div className="flex w-full gap-3 rounded-t-md bg-yellow-200 p-6">
            <input
                type="text"
                placeholder="What's happening?"
                className="grow bg-transparent text-slate-400 outline-none"
                disabled={isLoading}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                type="button"
                className="rounded-md bg-cyan-400 px-4 py-2 text-white"
                onClick={() => mutate({ content: value })}
            ></button>
        </div>
    );
};
