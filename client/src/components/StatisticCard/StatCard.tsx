/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { StatisticCard } from '@ant-design/pro-components';
import { ArrowUpOutlined } from '@ant-design/icons';

interface StatCardProps {
    title: string;
    prefix?: React.ReactNode;
    value: number;
    suffix?: string;
    valueStyle?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    prefix,
    value,
    suffix,
    valueStyle,
}) => {
    return (
        <StatisticCard
            style={{
                height: 130,
                width: 250,
            }}
            statistic={{
                title: title,
                prefix: prefix ? prefix : <ArrowUpOutlined />,
                value: value,
                suffix: suffix ? suffix : ' / 100',
                valueStyle: valueStyle ? valueStyle : { color: '#3f8600' }
            }}
        />
    );
};

export default StatCard;