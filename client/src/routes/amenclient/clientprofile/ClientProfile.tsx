import React, { useState, useEffect } from 'react';
import {
    DesktopOutlined,
    HomeOutlined,
    UserOutlined,
    CheckCircleOutlined,
    QuestionCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Divider, Row, Col, Table, Tag, Tabs, FloatButton } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import axios from 'axios';

import SimpleRadarChart from '../../../components/Charts/RadarChart/RadarChart';
import SimpleRadarChart2 from '../../../components/Charts/RadarChart/RadarChart2';

interface ClientProfileData {
    codeClient: string;
    codeCompte: string;
}

interface ClientData {
    Nom: string;
    Prenom: string;
    Identifiant: string;
    DateNaissance: string;
    Sexe: string;
    EtatCivil: string;
    Telephone: string;
    DateRejoindre: string;
    Libelle: string;
    TypeRelation: string;
    Adresse: string;
    Zone: string;
    Gouvernerat: string;
    CodePostal: string;
}

interface AccountData {
    CodeCompte: string;
    Libelle: string;
    DateCreation: string;
    DateValidation: string;
    Agence: string;
    CodeEmploye: string;
    EtatCompte: string;
}
interface ProductData {
    Nom: string;
    DateActivation: string;
    DateExpiration: string;
    Etat: string;
}

const columns = [
    {
        title: 'Code Compte',
        dataIndex: 'codeCompte',
    },
    {
        title: 'Type',
        dataIndex: 'typeCompte',
    },
    {
        title: 'Date Creation',
        dataIndex: 'dateCreation',
    },
    {
        title: 'Date Validation',
        dataIndex: 'dateValidation',
    },
    {
        title: 'Ouvert à',
        dataIndex: 'agence',
    },
    {
        title: 'Ouvert Par',
        dataIndex: 'employe',
    },
    {
        title: 'Etat',
        dataIndex: 'etatCompte',
    },
];

const produitColumns = [
    {
        title: 'Nom',
        dataIndex: 'Libelle',
        width: 140,
    },
    {
        title: 'Date Activation',
        dataIndex: 'dateActivation',
    },
    {
        title: 'Date Expiration',
        dataIndex: 'dateExpiration',
    },
    {
        title: 'Etat',
        dataIndex: 'etat',
    }
];

export const ClientProfile: React.FC<{ data: ClientProfileData }> = ({ data }) => {
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [compteData, setCompteData] = useState<AccountData | null>(null);
    const [bnqDataSource, setBnqDataSource] = useState<ProductData[]>([]);
    const [bnaDataSource, setBnaDataSource] = useState<ProductData[]>([]);
    const [crtDataSource, setCrtDataSource] = useState<ProductData[]>([]);
    const [pacDataSource, setPacDataSource] = useState<ProductData[]>([]);
    const { codeClient, codeCompte } = data;

    useEffect(() => {
        // Function to fetch client data when the component mounts
        const fetchClientData = async () => {
            try {
                const token = sessionStorage.getItem('userToken');
                const response = await axios.get('http://localhost:3000/client/data', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeClient: codeClient,
                    }
                });
                if (response.status === 200) {
                    // Set the client data in state if the request is successful
                    setClientData(response.data[0]);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        const fetchCompteData = async () => {
            try {
                const token = sessionStorage.getItem('userToken');
                const response = await axios.get('http://localhost:3000/accounts/data', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeCompte: codeCompte,
                    }
                });
                if (response.status === 200) {
                    // Set the client data in state if the request is successful
                    setCompteData(response.data[0]);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        const generateEtatTag = (etat: string) => {
            if (etat === 'A') {
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Actif
                    </Tag>
                );
            } else if (etat === 'D') {
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Inactif
                    </Tag>
                );
            } else {
                return (
                    <Tag icon={<QuestionCircleOutlined />} color="default">
                        Indéterminé
                    </Tag>
                );
            }
        };

        const fetchProductsData = async () => {
            try {
                const token = sessionStorage.getItem('userToken');
                // Fetch data for BNQ
                const bnqResponse = await axios.get('http://localhost:3000/products/bnq', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeCompte: codeCompte,
                    }
                });
                if (bnqResponse.status === 200) {
                    const bnqProducts = bnqResponse.data;
                    const bnqDataSource = bnqProducts.map((product, index) => ({
                        key: index.toString(),
                        Libelle: product.Nom,
                        dateActivation: new Date(product.DateActivation).toLocaleDateString(),
                        dateExpiration: new Date(product.DateExpiration).toLocaleDateString(),
                        etat: generateEtatTag(product.Etat),
                    }));
                    setBnqDataSource(bnqDataSource);
                } else {
                    throw new Error('Network response for BNQ was not ok');
                }
                // Fetch data for BNA
                const bnaResponse = await axios.get('http://localhost:3000/products/bna', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeCompte: codeCompte,
                    }
                });
                if (bnaResponse.status === 200) {
                    const bnaProducts = bnaResponse.data;
                    const bnaDataSource = bnaProducts.map((product, index) => ({
                        key: index.toString(),
                        Libelle: product.Nom,
                        dateActivation: new Date(product.DateActivation).toLocaleDateString(),
                        dateExpiration: new Date(product.DateExpiration).toLocaleDateString(),
                        etat: generateEtatTag(product.Etat),
                    }));
                    setBnaDataSource(bnaDataSource);
                } else {
                    throw new Error('Network response for BNA was not ok');
                }
                // Fetch data for CRT
                const crtResponse = await axios.get('http://localhost:3000/products/crt', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeCompte: codeCompte,
                    }
                });
                if (crtResponse.status === 200) {
                    const crtProducts = crtResponse.data;
                    const crtDataSource = crtProducts.map((product, index) => ({
                        key: index.toString(),
                        Libelle: product.Nom,
                        dateActivation: new Date(product.DateActivation).toLocaleDateString(),
                        dateExpiration: new Date(product.DateExpiration).toLocaleDateString(),
                        etat: generateEtatTag(product.Etat),
                    }));
                    setCrtDataSource(crtDataSource);
                } else {
                    throw new Error('Network response for CRT was not ok');
                }
                // Fetch data for PAC
                const pacResponse = await axios.get('http://localhost:3000/products/pac', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        codeCompte: codeCompte,
                    }
                });
                if (pacResponse.status === 200) {
                    const pacProducts = pacResponse.data;
                    const pacDataSource = pacProducts.map((product, index) => ({
                        key: index.toString(),
                        Libelle: product.Nom,
                        dateActivation: new Date(product.DateActivation).toLocaleDateString(),
                        dateExpiration: new Date(product.DateExpiration).toLocaleDateString(),
                        etat: generateEtatTag(product.Etat),
                    }));
                    setPacDataSource(pacDataSource);
                } else {
                    throw new Error('Network response for PAC was not ok');
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        // Call the fetchData function when the component mounts
        fetchClientData();
        fetchCompteData();
        fetchProductsData();
    }, [codeClient, codeCompte, data]);

    const BNQDigitalContent = (
        <Row align="middle" justify={'center'}>
            <Table dataSource={bnqDataSource} columns={produitColumns} pagination={false} />
            <SimpleRadarChart2 />
        </Row>
    );
    
    const BancassuranceContent = (
        <Row align="middle" justify={'center'}>
            <Table dataSource={bnaDataSource} columns={produitColumns} pagination={false} />
            <SimpleRadarChart />
        </Row>
    );
    
    const CartesContent = (
        <Row align="middle" justify={'center'}>
            <Table dataSource={crtDataSource} columns={produitColumns} pagination={false} />
            <SimpleRadarChart />
        </Row>
    );
    
    const PacksContent = (
        <Row align="middle" justify={'center'}>
            <Table dataSource={pacDataSource} columns={produitColumns} pagination={false} />
            <SimpleRadarChart />
        </Row>
    );

    const tabItems = [
        {
            label: 'BNQDigital',
            key: '1',
            children: BNQDigitalContent,
        },
        {
            label: 'Bancassurance',
            key: '2',
            children: BancassuranceContent,
        },
        {
            label: 'Cartes',
            key: '3',
            children: CartesContent,
        },
        {
            label: 'Packs',
            key: '4',
            children: PacksContent,
        },
    ];

    const etatCompteTag = () => {
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);
        if (compteData?.EtatCompte === 'A') {
            if (new Date(compteData?.DateValidation) <= sevenDaysFromNow) {
                return (
                    <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        Actif
                    </Tag>
                );
            } else {
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Actif
                    </Tag>
                );
            }
        } else if (compteData?.EtatCompte === 'C') {
            return (
                <Tag icon={<CloseCircleOutlined />} color="error">
                    Inactif
                </Tag>
            );
        }
        // Default tag if no condition matches
        return (
            <Tag icon={<QuestionCircleOutlined />} color="default">
                Indéterminé
            </Tag>
        );
    };

    const CompteDataSource = [
        {
            key: '1',
            codeCompte: compteData?.CodeCompte,
            typeCompte: compteData?.Libelle,
            dateCreation: compteData?.DateCreation && new Date(compteData.DateCreation).toLocaleDateString(),
            dateValidation: compteData?.DateValidation && new Date(compteData.DateValidation).toLocaleDateString(),
            agence: compteData?.Agence,
            employe: compteData?.CodeEmploye,
            etatCompte: etatCompteTag(),
        }
    ];

    return (
        <>
            <FloatButton tooltip={<div>Sortie</div>} icon={<CloseOutlined />} style={{ right: 24 }} href='/amenclient' />
            <Breadcrumb
                separator=">"
                items={[
                    {
                        title: (
                            <>
                                <HomeOutlined />
                                <span>Home</span>
                            </>
                        ),
                    },
                    {
                        title: (
                            <>
                                <DesktopOutlined />
                                <span>Amen Client</span>
                            </>
                        ),
                    },
                    {
                        title: (
                            <>
                                <UserOutlined />
                                <span>Profil Client</span>
                            </>
                        ),
                    },
                ]}
            />
            <Row align="middle" justify={'center'}>
                <Col span={15}>
                    <Divider orientation="left">Informations Générales</Divider>
                    <ProCard
                        bordered
                        split={'horizontal'}
                    >
                        <ProCard split="horizontal">
                            <ProCard split="horizontal">
                                <ProCard split={'vertical'}>
                                    <ProCard title="Nom">{clientData?.Nom}</ProCard>
                                    <ProCard title="Prénom">{clientData?.Prenom}</ProCard>
                                </ProCard>
                                <ProCard split="vertical">
                                    <ProCard title="Identifiant">{clientData?.Identifiant}</ProCard>
                                    <ProCard title="Date de Naissance">{clientData?.DateNaissance && new Date(clientData.DateNaissance).toLocaleDateString()}</ProCard>
                                    <ProCard title="Sexe">
                                        {clientData?.Sexe === 'M' ? 'Masculin' :
                                            clientData?.Sexe === 'F' ? 'Féminin' : ''}
                                    </ProCard>
                                    <ProCard title="Etat Civil">
                                        {clientData?.EtatCivil === 'M' ? 'Marié(e)' :
                                            clientData?.EtatCivil === 'C' ? 'Célibataire' :
                                                clientData?.EtatCivil === 'D' ? 'Divorcé(e)' :
                                                    clientData?.EtatCivil === 'V' ? 'Veuf/Veuve' : ''}
                                    </ProCard>
                                </ProCard>
                            </ProCard>
                            <ProCard split="vertical">
                                <ProCard title="Telephone">+216 {clientData?.Telephone}</ProCard>
                                <ProCard title="Date de Rejoindre">{clientData?.DateRejoindre && new Date(clientData.DateRejoindre).toLocaleDateString()}</ProCard>
                                <ProCard title="Segment" extra={clientData?.TypeRelation}>{clientData?.Libelle}</ProCard>
                            </ProCard>
                            <ProCard title="Adresse">{clientData?.Adresse}</ProCard>
                            <ProCard split="vertical">
                                <ProCard title="Zone">{clientData?.Zone}</ProCard>
                                <ProCard title="Gouvernerat">{clientData?.Gouvernerat}</ProCard>
                                <ProCard title="Code Postal">{clientData?.CodePostal}</ProCard>
                            </ProCard>
                        </ProCard>
                    </ProCard>
                </Col>
                <Col>
                    <Row align="middle" justify={'center'}>
                        <SimpleRadarChart />
                    </Row>
                </Col>
            </Row>
            <Divider orientation="left">Compte</Divider>
            <Table dataSource={CompteDataSource} columns={columns} pagination={false} />
            <Divider orientation="left">Produits</Divider>
            <Tabs
                tabPosition={'left'}
                items={tabItems}
            />
        </>
    );
};
