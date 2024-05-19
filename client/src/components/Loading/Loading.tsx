import {
    Row,
    Col,
    Result,
    Typography,
    Layout as AntdLayout,
} from "antd";
import {
    InfoCircleOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
// Manually defined
import { bouncy } from 'ldrs'

bouncy.register()


import "./styles.css";

const { Paragraph, Text } = Typography;

export const Loading: React.FC = () => {
    const navigate = useNavigate()
    const [loadingError, setLoadingError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataString = sessionStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : [];
                const codeEmploye = userData.length > 0 ? userData[0].CodeEmploye : '';
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();

                const response = await axios.get('http://localhost:3000/employe/stats', {
                    params: {
                        codeEmploye: codeEmploye,
                        year: currentYear,
                        quarter: null,
                        month: null,
                    },
                });
                // Check if response status is okay
                if (response.status === 200) {
                    const objectifResponse = await axios.get('http://localhost:3000/employe/objectif', {
                        params: {
                            codeEmploye: codeEmploye,
                            year: currentYear,
                            quarter: null,
                            month: null,
                        },
                    });
                    const fetchedObjectifData = objectifResponse.data[0];
                    navigate('/dashboard', {
                        state: {data: response.data, objectifData: fetchedObjectifData }
                    });
                } else {
                    // If response status is not okay, keep showing loading component
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setTimeout(() => {
                    setLoadingError(true);
                }, 2500);
            }
        };
        fetchData();
    });

    return (
        <AntdLayout className="layout">
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh",
                }}
            >
                <Col xs={25}>
                    <div className="container">
                        <div className="imageContainer">
                            <img src="./Logo_Amen_Bank.png" alt="Amen Bank Logo" />
                        </div>
                        {loadingError ? (
                            <Result
                                className="result-container"
                                status="error"
                                title="L'opération a échoué"
                                subTitle="Échec de la récupération des données de l'employé"
                            >
                                <div className="desc">
                                    <Paragraph>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: 16,
                                            }}
                                        >
                                            Veuillez d'abord vérifier votre connectivité, sinon :
                                        </Text>
                                    </Paragraph>
                                    <Paragraph>
                                        <InfoCircleOutlined className="site-result-demo-error-icon" /> contactez votre <a>service informatique &gt;</a>.
                                    </Paragraph>
                                    <Paragraph>
                                        <InfoCircleOutlined className="site-result-demo-error-icon" /> contactez votre <a>administration &gt;</a>.
                                    </Paragraph>
                                </div>
                            </Result>
                        ) : (
                            <l-bouncy
                                size="45"
                                speed="1.75"
                                color="#1d7623"
                            ></l-bouncy>
                        )}
                    </div>
                </Col>
            </Row>
        </AntdLayout>
    );
};
