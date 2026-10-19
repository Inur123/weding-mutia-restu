const invitationLoaderId = 'invitation-boot-loader';

export function dismissInvitationLoader(): void {
    const loader = document.getElementById(invitationLoaderId);

    if (!loader || loader.classList.contains('is-hiding')) {
        return;
    }

    const cover = document.getElementById('cover');

    if (!cover || window.getComputedStyle(cover).position !== 'fixed') {
        window.setTimeout(dismissInvitationLoader, 50);

        return;
    }

    loader.classList.add('is-hiding');
    window.dispatchEvent(new Event('invitation:ready'));

    window.setTimeout(() => {
        loader.parentNode?.removeChild(loader);
    }, 300);
}
