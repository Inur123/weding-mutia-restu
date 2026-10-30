import type { ComponentPropsWithRef, ElementType } from 'react';

type ProtectedTextProps<T extends ElementType> = {
    as?: T;
    className?: string;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'className' | 'translate'>;

/**
 * Atribut yang melindungi data identitas (nama, alamat, rekening) dari
 * penerjemahan otomatis browser. `translate="no"` dipakai Chrome/Edge/Safari,
 * sedangkan `notranslate` dipakai Google Translate dan ekstensi terjemahan.
 */
export function noTranslateProps(className?: string): {
    translate: 'no';
    className: string;
} {
    return {
        translate: 'no',
        className: className ? `notranslate ${className}` : 'notranslate',
    };
}

/**
 * Elemen untuk data identitas dinamis yang tidak boleh diterjemahkan atau
 * diubah browser. Elemen, ref, dan atribut lain diteruskan apa adanya.
 */
export function ProtectedText<T extends ElementType = 'span'>({
    as,
    className,
    ...props
}: ProtectedTextProps<T>) {
    const Component: ElementType = as ?? 'span';

    return <Component {...props} {...noTranslateProps(className)} />;
}
