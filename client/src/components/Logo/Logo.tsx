import { FlexProps, theme, Typography } from 'antd';
import { CSSProperties } from 'react';

type LogoProps = {
    color: CSSProperties['color'];
    imgSize?: {
        h?: number | string;
        w?: number | string;
    };
    asLink?: boolean;
    href?: string;
    bgColor?: CSSProperties['backgroundColor'];
    collapsed?: boolean;
} & Partial<FlexProps>;

export const Logo = ({
    color,
    imgSize,
    bgColor,
    collapsed,
    ...others
}: LogoProps) => {
    const {
        token: { borderRadius },
    } = theme.useToken();

    const maxHeight = collapsed ? '0' : '32px';

    return (
        <div gap={others.gap || 'small'} align="center" {...others}>
            <img
                src="/amenbank_logo.png"
                alt="Amen Bank logo"
                style={{ height: imgSize?.h || 48 }}
            />
            <Typography.Title
                level={5}
                type="secondary"
                className="amenadmin-logo-text"
                style={{
                    color,
                    margin: 0,
                    padding: `4px 8px`,
                    backgroundColor: bgColor,
                    borderRadius,
                    opacity: collapsed ? 0 : 1,
                    maxHeight: maxHeight,
                }}
            >
                Amen Admin
            </Typography.Title>
        </div>
    )
};
