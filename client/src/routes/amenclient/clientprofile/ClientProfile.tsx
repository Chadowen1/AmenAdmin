import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DesktopOutlined,
    LogoutOutlined,
    PieChartOutlined,
    HomeOutlined,
    AppstoreOutlined,
    MessageOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Breadcrumb, Flex, Tooltip, Dropdown, Divider, Table } from 'antd';

import { Logo } from "../../../components/Logo/Logo";
import HeaderNav from './HeaderNav.tsx';
import "./styles.css";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    const menuItemLabel =
        key === '1' ? (
            <Link to="/">{label}</Link>
        ) : key === '2' ? (
            <Link to="/amenclient">{label}</Link>
        ) : key === '5' ? (
            <Link to="/products">{label}</Link>
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
    getItem('Amen Client', '2', <DesktopOutlined />, [
        getItem('Profil Client', '4'),
        getItem('Produits', '5'),
    ]),
    getItem('Se déconnecter', '3', <LogoutOutlined />),
];

const columns = [
    {
        title: 'Code Compte',
        dataIndex: 'CodeCompte',
    },
    {
        title: 'Nom',
        dataIndex: 'Nom',
    },
    {
        title: 'Prenom',
        dataIndex: 'Prenom',
    },
    {
        title: 'Identifiant',
        dataIndex: 'Identifiant',
    },
];

export const ClientProfile: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 769 });
    const [navFill, setNavFill] = useState(false);
    const location = useLocation();
    const fetchedData = location.state?.data || [];

    const {
        token: { borderRadiusLG, borderRadius },
    } = theme.useToken();

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
                <Menu defaultSelectedKeys={['4']} defaultOpenKeys={['2']} mode="inline" items={items} />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: '100vh' }}>
                <HeaderNav
                    style={{
                        padding: '0 2rem 0 0',
                        background: navFill ? 'none' : 'rgba(199, 239, 207, 1)',
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
                        <Tooltip title="Apps">
                            <Button icon={<AppstoreOutlined />} type="text" size="large" />
                        </Tooltip>
                        <Tooltip title="Messages">
                            <Button icon={<MessageOutlined />} type="text" size="large" />
                        </Tooltip>
                        <Dropdown menu={{ items }} trigger={['click']}>
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
                    <Divider orientation="right"></Divider>
                    <Table columns={columns} dataSource={fetchedData} />
                </Content>
            </Layout>
        </Layout>
    );
};
