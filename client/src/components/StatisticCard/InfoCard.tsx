import React, { useEffect, useState } from 'react';
import { BidirectionalBar } from '@ant-design/plots';
import type { StatisticProps } from '@ant-design/pro-components';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Col, Row, Divider } from 'antd';
import axios from 'axios';

const { Statistic } = StatisticCard;

interface InfoCardProps {
    year: number;
    quarter: number | null;
    month: number | null;
}

export const InfoCard: React.FC<InfoCardProps> = ({ year, quarter, month }) => {
    const [data, setData] = useState<{ [key: string]: string }>({
        BancassuranceVendu: "0",
        BNQDigiVendus: "0",
        CartesVendus: "0",
        PacksVendu: "0",
        ComptesOuverts: "0",
    });
    const [objectifData, setObjectifData] = useState<{ [key: string]: string }>({
        SumObjectifBancassurance: "0",
        SumObjectifBNQDigi: "0",
        SumObjectifCartes: "0",
        SumObjectifPack: "0",
        SumOuvCpt: "0",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve userData from session storage
                const userDataString = sessionStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : [];

                // Extract codeEmploye from userData
                const codeEmploye = userData.length > 0 ? userData[0].CodeEmploye : '';

                // Fetch data using codeEmploye from userData
                const response = await axios.get('http://localhost:3000/employe/stats', {
                    params: {
                        codeEmploye: codeEmploye,
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });
                setData(response.data);

                // Fetch total objectif data
                const objectifResponse = await axios.get('http://localhost:3000/employe/objectif', {
                    params: {
                        codeEmploye: codeEmploye,
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });
                const fetchedObjectifData = objectifResponse.data[0];
                setObjectifData(fetchedObjectifData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [year, quarter, month]);

    const totalValue =
        parseInt(data.BancassuranceVendu) +
        parseInt(data.BNQDigiVendus) +
        parseInt(data.CartesVendus) +
        parseInt(data.PacksVendu) +
        parseInt(data.ComptesOuverts);

    const getStatus = (value: number, total: number) => {
        if (value < total) {
            return 'error';
        } else if (value >= total) {
            return 'success';
        }
        return 'default';
    };

    const items = [
        { key: '1', status: 'default', title: 'Total Objectif', value: totalValue, total: true },
        { key: '2', status: getStatus(parseInt(data.BancassuranceVendu), parseInt(objectifData.SumObjectifBancassurance)), title: 'Bancassurance', value: data.BancassuranceVendu },
        { key: '3', status: getStatus(parseInt(data.BNQDigiVendus), parseInt(objectifData.SumObjectifBNQDigi)), title: 'BNQDigital', value: data.BNQDigiVendus },
        { key: '4', status: getStatus(parseInt(data.CartesVendus), parseInt(objectifData.SumObjectifCartes)), title: 'Cartes', value: data.CartesVendus },
        { key: '5', status: getStatus(parseInt(data.PacksVendus), parseInt(objectifData.SumObjectifPack)), title: 'Packs', value: data.PacksVendus },
        { key: '6', status: getStatus(parseInt(data.ComptesOuverts), parseInt(objectifData.SumOuvCpt)), title: 'Comptes', value: data.ComptesOuverts },
    ];

    // const progress = 0.7;
    // const config = {
    //     autoFit: true,
    //     height: 18,
    //     percent: progress,
    //     color: ['#f0f0f0', '#6394f9'],
    //     annotations: [
    //         {
    //             type: 'text',
    //             style: {
    //                 text: `${progress * 100}%`,
    //                 x: '50%',
    //                 y: '50%',
    //                 textAlign: 'center',
    //                 fontSize: 11,
    //             },
    //         },
    //     ],
    // };

    const corporateData = [
        {
            segment: 'ASSOCIATION',
            'past': 13.4,
            'present': 12.3,
        },
        {
            segment: 'GROUPES',
            'past': 14.4,
            'present': 6.3,
        },
        {
            segment: 'PME',
            'past': 18.4,
            'present': 8.3,
        },
        {
            segment: 'GRANDE ENTREPRISE',
            'past': 34.4,
            'present': 13.8,
        },
        {
            segment: 'CORPORATE BBB',
            'past': 44.4,
            'present': 19.5,
        },
    ];
    const corporateConfig = {
        data: corporateData,
        height: 300,
        width: 515,
        sizeField: 15,
        xField: 'segment',
        yField: ['present', 'past'],
        legend: {
            color: {},
            size: {},
        },
        style: {
            fill: (d) => {
                if (d.groupKey === 'past') return '#64DAAB';
                return '#6395FA';
            },
        },
    };

    return (
        <ProCard
            tabs={{
                onChange: (key) => {
                    console.log('key', key);
                },
                items: items.map((item) => {
                    return {
                        key: item.key,
                        style: { width: '100%', margin: 0, padding: 0 },
                        label: (
                            <Statistic
                                layout="vertical"
                                title={item.title}
                                value={item.value}
                                status={item.status as StatisticProps['status']}
                                style={{
                                    width: 110,
                                    borderInlineEnd: item.total ? '1px solid #f0f0f0' : undefined,
                                }}
                            />
                        ),
                        children: (
                            <div
                                style={{
                                    backgroundColor: '#fafafa',
                                    padding: 0,
                                }}
                            >
                                <Row justify="center" style={{ paddingTop: 30 }}>
                                    {/* main objectif */}
                                </Row>
                                <Row justify="center" gutter={15} style={{ marginTop: 30 }}>
                                    <Col>
                                        {/* Bancassurance */}
                                    </Col>
                                    <Col>
                                        {/* BNQDigital */}
                                    </Col>
                                    <Col>
                                        {/* Cartes */}
                                    </Col>
                                    <Col>
                                        {/* Packs */}
                                    </Col>
                                </Row>
                                <Divider type={'horizontal'} />
                                <Row justify="center" gutter={4} align="bottom" style={{ marginTop: 30 }}>
                                    <Col>
                                        <Divider orientation="center">Corporate</Divider>
                                        <BidirectionalBar {...corporateConfig} />
                                    </Col>
                                    <Divider type={'vertical'} />
                                    <Col>
                                        <Divider orientation="center">Retail</Divider>
                                        <BidirectionalBar {...corporateConfig} />
                                    </Col>
                                </Row>
                            </div>
                        ),
                    };
                }),
            }}
        />
    );
};
