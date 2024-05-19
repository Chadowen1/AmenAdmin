import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DesktopOutlined,
    LogoutOutlined,
    PieChartOutlined,
    HomeOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    AuditOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Breadcrumb, Flex, Tooltip, Dropdown, Divider, DatePicker, Space, Table, Tag, Row } from 'antd';

import { Logo } from "../../components/Logo/Logo";
import HeaderNav from './HeaderNav.tsx';
import "./styles.css";

const { Content, Sider } = Layout;

const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
};

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

const dataSource = [
    {
        codeCompte:    <a href="">CC00R1Pq6e</a>,
        typeCompte: 'TC01',
        dateCreation: '2022-08-28',
        dateValidation: '2024-08-28',
        agence: 'CARNOY',
        employe: 'A01EE00378',
        etatCompte: <Tag icon={<CheckCircleOutlined />} color="success">
            Actif
        </Tag>,
    },
    {
        codeCompte:    <a href="">CC0jrR5r7o</a>,
        typeCompte: 'TC03',
        dateCreation: '2022-09-27',
        dateValidation: '2024-09-27',
        agence: 'SAHLOUL',
        employe: 'A20EE41408',
        etatCompte: <Tag icon={<CheckCircleOutlined />} color="success">
            Actif
        </Tag>,
    },
    {
        codeCompte:    <a href="">CC0sjfnHuA</a>,
        typeCompte: 'TC01',
        dateCreation: '2023-07-06',
        dateValidation: '2025-07-06',
        agence: 'DOUAR HICHER',
        employe: 'A13EE14431',
        etatCompte: <Tag icon={<CheckCircleOutlined />} color="error">
            Actif
        </Tag>,
    },
];

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    const menuItemLabel =
        key === '1' ? (
            <Link to="/dashboard">{label}</Link>
        ) : key === '2' ? (
            <Link to="/amenclient">{label}</Link>
        ) : key === '3' ? (
            <Link onClick={handleLogout} to="/">{label}</Link>
        ) : (
            label
        );
    return {
        key,
        icon,
        children,
        label: menuItemLabel,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Mon Dashboard', '1', <PieChartOutlined />),
    getItem('Amen Client', '2', <DesktopOutlined />,),
    getItem('Amen Comptes', '3', <AuditOutlined />),
    getItem('Se déconnecter', '4', <LogoutOutlined />),
];

const userDataString = sessionStorage.getItem('userData');
const userData = userDataString ? JSON.parse(userDataString) : [];
// Extract Nom and Prenom from user data if available
const nom = userData && userData.length > 0 ? userData[0].Nom : '';
const prenom = userData && userData.length > 0 ? userData[0].Prenom : '';
const codeEmploye = userData && userData.length > 0 ? userData[0].CodeEmploye : '';

const profileItems: MenuItem[] = [
    getItem(`${nom} ${prenom}`, ''), // Adjust accordingly
    getItem('Mon Profile', '5', <DesktopOutlined />),
    getItem('Se déconnecter', '4', <LogoutOutlined />), // Assuming handleLogout is defined
];

export const AmenComptes: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [use24HourFormat, setUse24HourFormat] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 769 });
    const [navFill, setNavFill] = useState(false);
    const {
        token: { borderRadiusLG, borderRadius },
    } = theme.useToken();

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleTimeFormat = () => {
        setUse24HourFormat(prevFormat => !prevFormat);
    };

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 5) {
                setNavFill(true);
            } else {
                setNavFill(false);
            }
        });
    }, []);

    return (
        <Layout hasSider style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}
                style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, transition: 'all .2s', borderRight: '1px solid #96bc9e', }}>
                <Logo
                    color="black"
                    justify="center"
                    gap="small"
                    imgSize={{ h: 35, w: 35 }}
                    style={{ padding: '1rem 0' }}
                    collapsed={collapsed}
                />
                <Menu
                    defaultSelectedKeys={['3']} // Initial default selected keys
                    mode="inline"
                    items={items}
                />
                <div style={{ textAlign: 'center', position: 'absolute', bottom: '1rem', left: 0, right: 0 }}>
                    Bonjour {nom} {prenom}!
                    <div>{codeEmploye}</div>
                </div>
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: '100vh' }}>
                <HeaderNav
                    style={{
                        padding: '0 2rem 0 0',
                        background: navFill ? 'none' : 'rgba(244, 245, 247, 1)',
                        backdropFilter: navFill ? 'blur(8px)' : 'none',
                        boxShadow: navFill ? '0 0 8px 2px rgba(0, 0, 0, 0.05)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        gap: 8,
                        transition: 'all .25s',
                        borderBottom: '1px solid #96bc9e',
                    }}
                >
                    <Flex align="center">
                        <Tooltip title={`${collapsed ? 'Expand' : 'Collapse'} Sidebar`}>
                            <Button
                                type="text"
                                icon={
                                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Tooltip>
                    </Flex>
                    <Flex align="center" gap="small">
                        <Tooltip> {date.toLocaleTimeString([], { hour12: !use24HourFormat })} </Tooltip>
                        <Tooltip>
                            <Button icon={<ClockCircleOutlined />} type="text" size="large" onClick={toggleTimeFormat} />
                        </Tooltip>
                        <Tooltip> {date.toLocaleDateString()} </Tooltip>
                        <Tooltip>
                            <Button icon={<CalendarOutlined />} type="text" size="large" />
                        </Tooltip>
                        <Dropdown menu={{ items: profileItems }} trigger={['click']}>
                            <Flex>
                                <img
                                    src="/amenbank_logo.png"
                                    alt="user profile photo"
                                    height={36}
                                    width={36}
                                    style={{ borderRadius, objectFit: 'cover' }}
                                />
                            </Flex>
                        </Dropdown>
                    </Flex>
                </HeaderNav>
                <Content style={{
                    margin: '24px 16px',
                    padding: 10,
                    minHeight: 280,
                    borderRadius: borderRadiusLG,
                }}
                >
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
                                        <span>Amen Comptes</span>
                                    </>
                                ),
                            },
                        ]}
                    />
                    <Divider orientation="right">
                        <Space>
                            <DatePicker picker="year" />
                            <DatePicker picker="quarter" defaultValue={null} />
                            <DatePicker picker="month" defaultValue={null} />
                        </Space>
                    </Divider>
                    <Divider orientation="left">
                        Liste des comptes non équipés
                    </Divider>
                    <Row align="middle" justify={'center'} style={{marginTop: 50}}>
                        <Table dataSource={dataSource} columns={columns} />
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};
