import React, { useEffect, useState } from 'react';
import type { StatisticProps } from '@ant-design/pro-components';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import axios from 'axios';

import { TotalStats } from '../Statistics/TotalStats/TotalStats';
import { BNQDigitalStats } from '../Statistics/BNQDigitalStats/BNQDigitalStats';
import { DataLoading } from '../Loading/DataLoading';

import './styles.css';

const { Statistic } = StatisticCard;

interface InfoCardProps {
    year: number;
    quarter: number | null;
    month: number | null;
    data: {
        BancassuranceVendus: string;
        BNQDigiVendus: string;
        CartesVendus: string;
        PacksVendus: string;
        ComptesOuverts: string;
    };
    objectifData: {
        SumObjectifBancassurance: string;
        SumObjectifBNQDigi: string;
        SumObjectifCartes: string;
        SumObjectifPack: string;
        SumOuvCpt: string;
    };
}

export const InfoCard: React.FC<InfoCardProps> = ({ year, quarter, month, data: initialData, objectifData: initialObjectifData }) => {
    const [loading, setLoading] = useState(true);

    const mockObjectifData = {
        SumObjectifBancassurance: "55",
        SumObjectifBNQDigi: "72",
        SumObjectifCartes: "43",
        SumObjectifPack: "50",
        SumOuvCpt: "26",
    };

    // Sample mock data
    const mockData = {
        BancassuranceVendus: "65",
        BNQDigiVendus: "70",
        CartesVendus: "61",
        PacksVendus: "52",
        ComptesOuverts: "24",
    };

    const [data, setData] = useState(mockData);

    const [objectifData, setObjectifData] = useState(mockObjectifData);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataString = sessionStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : [];
                const codeEmploye = userData.length > 0 ? userData[0].CodeEmploye : '';
                
                const response = await axios.get('http://localhost:3000/employe/stats', {
                    params: {
                        codeEmploye: codeEmploye,
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });

                // Check if response status is okay
                if (response.status === 200) {
                    //setData(response.data);
                    const objectifResponse = await axios.get('http://localhost:3000/employe/objectif', {
                        params: {
                            codeEmploye: codeEmploye,
                            year: year,
                            quarter: quarter,
                            month: month,
                        },
                    });
                    const fetchedObjectifData = objectifResponse.data[0];
                    //setObjectifData(fetchedObjectifData);
                } else {
                    // If response status is not okay, keep showing loading component
                    console.error('Error fetching data:', response.statusText);
                }
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false if there's an error
            }
        };
        fetchData();
    }, [year, quarter, month]);

    if (loading) {
        return <DataLoading />; // Render loading component while loading is true
    }

    // const totalValue =
    //     parseInt(data.BancassuranceVendus) +
    //     parseInt(data.BNQDigiVendus) +
    //     parseInt(data.CartesVendus) +
    //     parseInt(data.PacksVendus) +
    //     parseInt(data.ComptesOuverts);
    const totalValue = 272;

    const getStatus = (value: number, total: number) => {
        if (value < total) {
            return 'error';
        } else if (value >= total) {
            return 'success';
        }
        return 'default';
    };

    const items = [
        { key: '1', status: 'default', title: 'Total', value: totalValue, total: true },
        { key: '2', status: getStatus(parseInt(data.BancassuranceVendus), parseInt(objectifData.SumObjectifBancassurance)), title: 'Bancassurance', value: data.BancassuranceVendus },
        { key: '3', status: getStatus(parseInt(data.BNQDigiVendus), parseInt(objectifData.SumObjectifBNQDigi)), title: 'BNQDigital', value: data.BNQDigiVendus },
        { key: '4', status: getStatus(parseInt(data.CartesVendus), parseInt(objectifData.SumObjectifCartes)), title: 'Cartes', value: data.CartesVendus },
        { key: '5', status: getStatus(parseInt(data.PacksVendus), parseInt(objectifData.SumObjectifPack)), title: 'Packs', value: data.PacksVendus },
        { key: '6', status: getStatus(parseInt(data.ComptesOuverts), parseInt(objectifData.SumOuvCpt)), title: 'Comptes', value: data.ComptesOuverts },
    ];

    return (
        <ProCard
            style={{backgroundColor: '#f4f5f7'}}
            tabs={{
                items: items.map((item) => {
                    return {
                        key: item.key,
                        style: { width: '100%', margin: 0, padding: 0},
                        label: (
                            <Statistic
                                layout="vertical"
                                title={item.title}
                                value={item.value}
                                status={item.status as StatisticProps['status']}
                                style={{
                                    width: 110,
                                    borderInlineEnd: item.total ? '1px solid #96bc9e' : undefined,
                                }}
                            />
                        ),
                        children: (
                            <div
                                style={{
                                    backgroundColor: '#f4f5f7',
                                    padding: 0,
                                }}
                            >
                                {item.key === '1' && <TotalStats data={data} objectifData={objectifData} year={year} quarter={quarter} month={month} />}
                                {item.key === '3' && <BNQDigitalStats BNQDigiVendus={data.BNQDigiVendus} SumObjectifBNQDigi={objectifData.SumObjectifBNQDigi} year={year} quarter={quarter} month={month} />}
                            </div>
                        ),
                    };
                }),
            }}
        />
    );
};
