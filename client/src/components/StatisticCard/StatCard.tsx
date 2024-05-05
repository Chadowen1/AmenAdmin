import React from 'react';
import { StatisticCard } from '@ant-design/pro-components';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Progress } from 'antd';

interface StatCardProps {
    title: string;
    prefix?: React.ReactNode;
    value: string;
    suffix?: string;
    valueStyle?: React.CSSProperties;
    height?: number;
    width?: number;
    progress?: number;
    strokeColor?: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    prefix,
    value,
    suffix,
    valueStyle,
    height = 130,
    width = 250, 
    progress = 0,
    onClick,
}) => {
    const formattedProgress = Number(progress.toFixed(2));
    const strokeColor = formattedProgress < 100 ? '#ff4d4f' : '#52c41a';
    return (
        <StatisticCard
            hoverable
            onClick={onClick}
            style={{
                height: height,
                width: width,
            }}
            statistic={{
                title: title,
                prefix: prefix ? prefix : <ArrowUpOutlined />,
                value: value,
                suffix: suffix ? suffix : ' / 100',
                valueStyle: valueStyle ? valueStyle : { color: '#3f8600' }
            }}
            chart={<Progress percent={formattedProgress} type="line" strokeColor={strokeColor}/>}
        />
    );
};

export default StatCard;