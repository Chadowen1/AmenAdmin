import React, { useEffect, useState } from 'react';
import { Col, Row, Divider } from 'antd';
import {
    MinusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import axios from 'axios';

import StatCard from '../../StatisticCard/StatCard';

interface BNQDigitalStatsProps {
    year: number;
    quarter: number | null;
    month: number | null;
    BNQDigiVendus: string;
    SumObjectifBNQDigi: string;
}

export const BNQDigitalStats: React.FC<BNQDigitalStatsProps> = ({ year, quarter, month, BNQDigiVendus, SumObjectifBNQDigi }) => {
    const [data, setData] = useState<{
        NomProduit: string;
        QuantitySold: string;
    }[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve userData from session storage
                const userDataString = sessionStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : [];
                // Extract codeEmploye from userData
                const codeEmploye = userData.length > 0 ? userData[0].CodeEmploye : '';
                // Fetch data using codeEmploye from userData
                const response = await axios.get('http://localhost:3000/products/bnq/stats', {
                    params: {
                        codeEmploye: codeEmploye,
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [year, quarter, month]);

    return (
        <>
            <Row justify="center" style={{ paddingTop: 30 }}>
                <StatCard
                    title="Total BNQDigital Vendus"
                    width={500}
                    value={BNQDigiVendus !== '' ? String(BNQDigiVendus) : 'NA'}
                    suffix={SumObjectifBNQDigi !== null ? ` / ${SumObjectifBNQDigi}` : 'NA'}
                    prefix={
                        parseInt(BNQDigiVendus) < parseInt(SumObjectifBNQDigi)
                            ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                            : parseInt(BNQDigiVendus) === parseInt(SumObjectifBNQDigi)
                                ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                    }
                    valueStyle={
                        parseInt(BNQDigiVendus) < parseInt(SumObjectifBNQDigi)
                            ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                            : parseInt(BNQDigiVendus) === parseInt(SumObjectifBNQDigi)
                                ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                    }
                    progress={(parseInt(BNQDigiVendus) / parseInt(SumObjectifBNQDigi)) * 100}
                />
            </Row>
            <Row justify="center" gutter={15} style={{ marginTop: 30 }}>
            {data.map((item, index) => (
                <Col key={index}>
                    <StatCard
                        title={item.NomProduit}
                        value={item.QuantitySold !== '' ? String(item.QuantitySold) : 'NA'}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Col>
            ))}
            </Row>
            <Divider type={'horizontal'} />
            <Row justify="center" gutter={4} align="bottom" style={{ marginTop: 30 }}>
            </Row>
        </>
    );
};
