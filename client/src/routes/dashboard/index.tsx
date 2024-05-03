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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Breadcrumb, Flex, Tooltip, Dropdown, Divider, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

import { InfoCard } from "../../components/StatisticCard/InfoCard.tsx"
import { Logo } from "../../components/Logo/Logo";
import { Loading } from '../../components/Loading/Loading';
import HeaderNav from './HeaderNav.tsx';
import "./styles.css";

const { Content, Sider } = Layout;

const handleLogout = () => {
    // Clear the user data and token from sessionStorage
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
};

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
        ) : key === '3' ? (
            <Link onClick={handleLogout} to="/">{label}</Link>
        ) : key === '4' ? (
            <Link to="/employeprofile">{label}</Link>
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
    getItem('Amen Client', '2', <DesktopOutlined />),
    getItem('Se déconnecter', '3', <LogoutOutlined />),
];
const yearFormat = 'YYYY';
// const quarterFormat = 'YYYY-[Q]Q';
const userDataString = sessionStorage.getItem('userData');
const userData = userDataString ? JSON.parse(userDataString) : [];
// Extract Nom and Prenom from user data if available
const nom = userData && userData.length > 0 ? userData[0].Nom : '';
const prenom = userData && userData.length > 0 ? userData[0].Prenom : '';

const profileItems: MenuItem[] = [
    getItem(`${nom} ${prenom}`, ''), // Adjust accordingly
    getItem('Mon Profile', '4', <DesktopOutlined />),
    getItem('Se déconnecter', '3', <LogoutOutlined />), // Assuming handleLogout is defined
];

export const Dashboard: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [use24HourFormat, setUse24HourFormat] = useState(true);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 769 });
    const [navFill, setNavFill] = useState(false);
    const currentYear = dayjs(date).format(yearFormat);
    const {
        token: { borderRadiusLG, borderRadius },
    } = theme.useToken();
    const [selectedYear, setSelectedYear] = useState<number>(dayjs(date).year());
    const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
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
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 5) {
                setNavFill(true);
            } else {
                setNavFill(false);
            }
        });
    }, []);

    const handleYearPickerChange = (date) => {
        const year = date.year();
        setSelectedYear(year);
    };

    const handleQuarterPickerChange = (date) => {
        const quarter = date.quarter();
        setSelectedQuarter(quarter);
    };

    const handleMonthPickerChange = (date) => {
        const month = date.month() + 1; // month() returns 0-indexed month
        setSelectedMonth(month);
    };

    if (loading) {
        return <Loading />;
    }

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
                <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
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
                    margin: '15px 10px',
                    padding: 5,
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
                                        <PieChartOutlined />
                                        <span>Mon Dashboard</span>
                                    </>
                                ),
                            },
                        ]}
                    />
                    <Divider orientation="right">
                        <Space>
                            <DatePicker picker="year" defaultValue={dayjs(currentYear, yearFormat)} format={yearFormat} onChange={handleYearPickerChange} />
                            <DatePicker picker="quarter" defaultValue={null} onChange={handleQuarterPickerChange} />
                            <DatePicker picker="month" defaultValue={null} onChange={handleMonthPickerChange} />
                        </Space>
                    </Divider>
                    <InfoCard year={selectedYear} quarter={selectedQuarter} month={selectedMonth} />
                </Content>
            </Layout>
        </Layout>
    );
};