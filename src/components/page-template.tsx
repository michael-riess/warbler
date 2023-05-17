import { type PropsWithChildren } from 'react';

export const PageTemplate = (props: PropsWithChildren) => {
    return (
        // 64px is the height of the header
        <main className="flex justify-center overscroll-none h-[calc(100vh-64px)]">
            <div className="w-full rounded-md border-x border-yellow-200 md:max-w-2xl overflow-y-scroll">
                {props.children}
            </div>
        </main>
    );
};
