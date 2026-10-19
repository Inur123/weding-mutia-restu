import { usePage } from '@inertiajs/react';

import Favicon from '../../images/theme-special03/couple.jpg';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                <img
                    src={Favicon}
                    alt={name as string}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
