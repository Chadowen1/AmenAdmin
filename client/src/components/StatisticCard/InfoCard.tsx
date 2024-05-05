import React, { useEffect, useState } from 'react';
import type { StatisticProps } from '@ant-design/pro-components';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { TotalStats } from '../Statistics/TotalStats/TotalStats';
import axios from 'axios';

const { Statistic } = StatisticCard;

interface InfoCardProps {
    year: number;
    quarter: number | null;
    month: number | null;
}

export const InfoCard: React.FC<InfoCardProps> = ({ year, quarter, month }) => {
    const [data, setData] = useState<{
        BancassuranceVendus: string;
        BNQDigiVendus: string;
        CartesVendus: string;
        PacksVendus: string;
        ComptesOuverts: string;
    }>({
        BancassuranceVendus: "0",
        BNQDigiVendus: "0",
        CartesVendus: "0",
        PacksVendus: "0",
        ComptesOuverts: "0",
    });
    const [objectifData, setObjectifData] = useState<{
        SumObjectifBancassurance: string;
        SumObjectifBNQDigi: string;
        SumObjectifCartes: string;
        SumObjectifPack: string;
        SumOuvCpt: string;
    }>({
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
                console.log("quarter: ", quarter);
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
        parseInt(data.BancassuranceVendus) +
        parseInt(data.BNQDigiVendus) +
        parseInt(data.CartesVendus) +
        parseInt(data.PacksVendus) +
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
        { key: '2', status: getStatus(parseInt(data.BancassuranceVendus), parseInt(objectifData.SumObjectifBancassurance)), title: 'Bancassurance', value: data.BancassuranceVendus },
        { key: '3', status: getStatus(parseInt(data.BNQDigiVendus), parseInt(objectifData.SumObjectifBNQDigi)), title: 'BNQDigital', value: data.BNQDigiVendus },
        { key: '4', status: getStatus(parseInt(data.CartesVendus), parseInt(objectifData.SumObjectifCartes)), title: 'Cartes', value: data.CartesVendus },
        { key: '5', status: getStatus(parseInt(data.PacksVendus), parseInt(objectifData.SumObjectifPack)), title: 'Packs', value: data.PacksVendus },
        { key: '6', status: getStatus(parseInt(data.ComptesOuverts), parseInt(objectifData.SumOuvCpt)), title: 'Comptes', value: data.ComptesOuverts },
    ];

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
                                <TotalStats data={data} objectifData={objectifData} year={year} quarter={quarter} month={month} />
                            </div>
                        ),
                    };
                }),
            }}
        />
    );
};
