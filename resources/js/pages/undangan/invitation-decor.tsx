import floralBottom from '../../../images/theme-special03/floral-bottom.png';
import floralSide from '../../../images/theme-special03/floral-side.png';
import floralTop from '../../../images/theme-special03/floral-top.png';

type DecorVariant = 'cover' | 'hero' | 'paper' | 'brown';

export function InvitationDecor({
    variant = 'paper',
}: {
    variant?: DecorVariant;
}) {
    return (
        <div
            className={`reference-decor reference-decor--${variant}`}
            aria-hidden="true"
        >
            {variant !== 'cover' && (
                <>
                    <span
                        className="floral floral--top-left"
                        data-reveal="left"
                        data-motion
                    >
                        <img src={floralTop} alt="" />
                    </span>
                    <span
                        className="floral floral--top-right"
                        data-reveal="down"
                        data-motion
                    >
                        <img src={floralSide} alt="" />
                    </span>
                </>
            )}
            <span
                className="floral floral--bottom-left"
                data-reveal="up"
                data-motion
            >
                <span className="floral__flip">
                    <img src={floralSide} alt="" />
                </span>
            </span>
            <span
                className="floral floral--bottom-right"
                data-reveal="right"
                data-motion
            >
                <img src={floralBottom} alt="" />
            </span>
        </div>
    );
}

export function PortraitFlowers() {
    return (
        <div className="portrait-flowers" aria-hidden="true">
            <span
                className="portrait-flower"
                data-reveal="right"
                data-reveal-delay="800"
                data-motion
            >
                <span className="portrait-flower__flip">
                    <img src={floralSide} alt="" />
                </span>
            </span>
            <span
                className="portrait-flower portrait-flower--right"
                data-reveal="left"
                data-reveal-delay="800"
                data-motion
            >
                <span className="portrait-flower__flip">
                    <img src={floralSide} alt="" />
                </span>
            </span>
        </div>
    );
}
