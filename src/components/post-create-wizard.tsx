import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '~/utils/api';

import { LoadingSpinner } from './loading-spinner';
import { className } from './utils/classname';

export const PostCreateWizard = ({ isSticky }: { isSticky: boolean }) => {
    const ctx = api.useContext();

    const [value, setValue] = useState('');
    const { mutate, isLoading } = api.post.create.useMutation({
        onSuccess: async () => {
            setValue('');
            await ctx.post.getAll.invalidate();
        },
        onError: (err) => {
            switch (err.data?.code) {
                case 'TOO_MANY_REQUESTS':
                    toast('😵‍💫 Woah, slow down there!');
                    break;
                default:
                    toast(
                        '🤷‍♂️ Looks like something went wrong! Try again later.'
                    );
            }
        },
    });

    const { user } = useUser();
    if (!user) return null;

    return (
        <div
            className={className(
                'flex w-full gap-3 rounded-t-md bg-yellow-200 p-6',
                isSticky && 'sticky top-0 z-10'
            )}
        >
            <input
                type="text"
                placeholder="What's happening?"
                className="grow bg-transparent text-slate-400 outline-none"
                disabled={isLoading}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    if (value === '') return;
                    mutate({ content: value });
                }}
            />
            {!(isLoading || value?.length === 0) && (
                <button
                    type="button"
                    className="rounded-md bg-cyan-400 px-4 py-2 text-white"
                    onClick={() => mutate({ content: value })}
                >
                    🦜
                </button>
            )}
            {isLoading && (
                <div className="flex justify-center items-center">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};
