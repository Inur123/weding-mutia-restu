import { usePage } from '@inertiajs/react';

import { noTranslateProps, ProtectedText } from '@/components/protected-text';
import Favicon from '../../images/theme-special03/utama-warm.jpg';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                <img
                    src={Favicon}
                    alt={name as string}
                    {...noTranslateProps()}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <ProtectedText className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </ProtectedText>
            </div>
        </>
    );
}
