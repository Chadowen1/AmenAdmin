import React, { useEffect, useState } from 'react';
import { Col, Row, Divider } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    MinusOutlined,
} from '@ant-design/icons';
import axios from 'axios';

import StatCard from '../../StatisticCard/StatCard';
import HorizontalBarChart from '../../Charts/HorizontalBarChart/HorizontalBarChart'

interface TotalStatsProps {
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
    year: number;
    quarter: number | null;
    month: number | null;
}

export const TotalStats: React.FC<TotalStatsProps> = ({ data, objectifData, year, quarter, month }) => {
    const sumObjectifData = parseInt(objectifData.SumObjectifBancassurance)
        + parseInt(objectifData.SumObjectifBNQDigi)
        + parseInt(objectifData.SumObjectifCartes)
        + parseInt(objectifData.SumObjectifPack)
        + parseInt(objectifData.SumOuvCpt);
    const sumData = parseInt(data.BancassuranceVendus)
        + parseInt(data.BNQDigiVendus)
        + parseInt(data.CartesVendus)
        + parseInt(data.PacksVendus)
        + parseInt(data.ComptesOuverts);
    const [corporateData, setCorporateData] = useState([]);
    const [retailData, setRetailData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataString = sessionStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : [];
                // Extract codeEmploye from userData
                const codeEmploye = userData.length > 0 ? userData[0].CodeEmploye : '';
                const responseRetail = await axios.get('http://localhost:3000/employe/produitStats', {
                    params: {
                        codeEmploye: codeEmploye,
                        relation: "RETAIL",
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });
                setRetailData(responseRetail.data);
                const responseCorporate = await axios.get('http://localhost:3000/employe/produitStats', {
                    params: {
                        codeEmploye: codeEmploye,
                        relation: "CORPORATE",
                        year: year,
                        quarter: quarter,
                        month: month,
                    },
                });
                setCorporateData(responseCorporate.data);         
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [year, quarter, month]);

    return (
        <>
            <Row justify="center" style={{ paddingTop: 30 }}>
                <StatCard
                    title="Total Objectif"
                    width={500}
                    value={String(sumData) !== '' ? String(sumData) : 'NA'}
                    suffix={Object.keys(objectifData).length > 0 && sumObjectifData !== null ? ` / ${sumObjectifData}` : 'NA'}
                    prefix={
                        Object.keys(objectifData).length > 0 && sumData < sumObjectifData
                            ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                            : Object.keys(objectifData).length > 0 && sumData === sumObjectifData
                                ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                    }
                    valueStyle={
                        Object.keys(objectifData).length > 0 && sumData < sumObjectifData
                            ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                            : Object.keys(objectifData).length > 0 && sumData === sumObjectifData
                                ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                    }
                    progress={(sumData / sumObjectifData) * 100}
                />
            </Row>
            <Row justify="center" gutter={15} style={{ marginTop: 30 }}>
                <Col>
                    <StatCard
                        title="Bancassurance"
                        value={data.BancassuranceVendus !== '' ? String(data.BancassuranceVendus) : 'NA'}
                        suffix={Object.keys(objectifData).length > 0 && objectifData.SumObjectifBancassurance !== null ? ` / ${objectifData.SumObjectifBancassurance}` : 'NA'}
                        prefix={
                            Object.keys(objectifData).length > 0 && parseInt(data.BancassuranceVendus) < parseInt(objectifData.SumObjectifBancassurance)
                                ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.BancassuranceVendus) === parseInt(objectifData.SumObjectifBancassurance)
                                    ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                    : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                        }
                        valueStyle={
                            Object.keys(objectifData).length > 0 && parseInt(data.BancassuranceVendus) < parseInt(objectifData.SumObjectifBancassurance)
                                ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.BancassuranceVendus) === parseInt(objectifData.SumObjectifBancassurance)
                                    ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                    : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                        }
                        progress={(parseInt(data.BancassuranceVendus) / parseInt(objectifData.SumObjectifBancassurance)) * 100}
                    />
                </Col>
                <Col>
                    <StatCard
                        title="BNQDigital"
                        value={data.BNQDigiVendus !== '' ? String(data.BNQDigiVendus) : 'NA'}
                        suffix={Object.keys(objectifData).length > 0 && objectifData.SumObjectifBNQDigi !== null ? ` / ${objectifData.SumObjectifBNQDigi}` : 'NA'}
                        prefix={
                            Object.keys(objectifData).length > 0 && parseInt(data.BNQDigiVendus) < parseInt(objectifData.SumObjectifBNQDigi)
                                ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.BNQDigiVendus) === parseInt(objectifData.SumObjectifBNQDigi)
                                    ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                    : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                        }
                        valueStyle={
                            Object.keys(objectifData).length > 0 && parseInt(data.BNQDigiVendus) < parseInt(objectifData.SumObjectifBNQDigi)
                                ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.BNQDigiVendus) === parseInt(objectifData.SumObjectifBNQDigi)
                                    ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                    : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                        }
                        progress={(parseInt(data.BNQDigiVendus) / parseInt(objectifData.SumObjectifBNQDigi)) * 100}
                    />
                </Col>
                <Col>
                    <StatCard
                        title="Cartes"
                        value={data.CartesVendus !== '' ? String(data.CartesVendus) : 'NA'}
                        suffix={Object.keys(objectifData).length > 0 && objectifData.SumObjectifCartes !== null ? ` / ${objectifData.SumObjectifCartes}` : 'NA'}
                        prefix={
                            Object.keys(objectifData).length > 0 && parseInt(data.CartesVendus) < parseInt(objectifData.SumObjectifCartes)
                                ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.CartesVendus) === parseInt(objectifData.SumObjectifCartes)
                                    ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                    : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                        }
                        valueStyle={
                            Object.keys(objectifData).length > 0 && parseInt(data.CartesVendus) < parseInt(objectifData.SumObjectifCartes)
                                ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.CartesVendus) === parseInt(objectifData.SumObjectifCartes)
                                    ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                    : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                        }
                        progress={(parseInt(data.CartesVendus) / parseInt(objectifData.SumObjectifCartes)) * 100}
                    />
                </Col>
                <Col>
                    <StatCard
                        title="Packs"
                        value={data.PacksVendus !== '' ? String(data.PacksVendus) : 'NA'}
                        suffix={Object.keys(objectifData).length > 0 && objectifData.SumObjectifPack !== null ? ` / ${objectifData.SumObjectifPack}` : 'NA'}
                        prefix={
                            Object.keys(objectifData).length > 0 && parseInt(data.PacksVendus) < parseInt(objectifData.SumObjectifPack)
                                ? <ArrowDownOutlined /> // Down arrow if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.PacksVendus) === parseInt(objectifData.SumObjectifPack)
                                    ? <MinusOutlined /> // Minus icon if PacksVendu is equal to ObjectifPack
                                    : <ArrowUpOutlined /> // Up arrow if PacksVendu is greater than ObjectifPack
                        }
                        valueStyle={
                            Object.keys(objectifData).length > 0 && parseInt(data.PacksVendus) < parseInt(objectifData.SumObjectifPack)
                                ? { color: '#cf1322' } // Red color if PacksVendu is less than ObjectifPack
                                : Object.keys(objectifData).length > 0 && parseInt(data.PacksVendus) === parseInt(objectifData.SumObjectifPack)
                                    ? { color: '#3f8600' } // Green color if PacksVendu is equal to ObjectifPack
                                    : { color: '#3f8600' } // Green color if PacksVendu is greater than ObjectifPack
                        }
                        progress={(parseInt(data.PacksVendus) / parseInt(objectifData.SumObjectifPack)) * 100}
                    />
                </Col>
            </Row>
            <Divider type={'horizontal'} />
            <Row justify="center" gutter={4} align="bottom" style={{ marginTop: 30 }}>
                <Col className="chartContainer">
                    <Divider orientation="center">Corporate</Divider>
                    <HorizontalBarChart data={corporateData} />
                </Col>
                <Divider type={'vertical'} />
                <Col>
                    <Divider orientation="center">Retail</Divider>
                    <HorizontalBarChart data={retailData} />
                </Col>
            </Row>
        </>
    );
};
