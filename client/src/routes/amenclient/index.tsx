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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Breadcrumb, Flex, Tooltip, Dropdown, Divider, Card, Form, Col, Row, Select, Input, message } from 'antd';
import axios from 'axios';

import { Logo } from "../../components/Logo/Logo";
import HeaderNav from './HeaderNav.tsx';
import { ClientProfile } from './clientprofile/ClientProfile.tsx';
import "./styles.css";

const { Content, Sider } = Layout;
const { Option } = Select;

const handleLogout = () => {
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
    getItem('Se déconnecter', '3', <LogoutOutlined />),
];

const userDataString = sessionStorage.getItem('userData');
const userData = userDataString ? JSON.parse(userDataString) : [];
// Extract Nom and Prenom from user data if available
const nom = userData && userData.length > 0 ? userData[0].Nom : '';
const prenom = userData && userData.length > 0 ? userData[0].Prenom : '';
const codeEmploye = userData && userData.length > 0 ? userData[0].CodeEmploye : '';

const profileItems: MenuItem[] = [
    getItem(`${nom} ${prenom}`, ''), // Adjust accordingly
    getItem('Mon Profile', '4', <DesktopOutlined />),
    getItem('Se déconnecter', '3', <LogoutOutlined />), // Assuming handleLogout is defined
];

interface ClientProfileData {
    codeClient: string;
    codeCompte: string;
}

export const AmenClient: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [use24HourFormat, setUse24HourFormat] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 769 });
    const [navFill, setNavFill] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState("codeCompte");
    const [showClientProfile, setShowClientProfile] = useState(false); // State to control rendering of ClientProfile
    const [clientProfileData, setClientProfileData] = useState<ClientProfileData | null>(null); // State to store data for ClientProfile
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['2']);
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

    useEffect(() => {
        if (showClientProfile) {
            setSelectedKeys(['2-1']); // Set to submenu item when ClientProfile is rendered
        } else {
            setSelectedKeys(['2']); // Set to main Amen Client item otherwise
        }
    }, [showClientProfile]);

    const handleInputChange = (e) => {
        if (selectedOption == 'ncrt') {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/\D/g, '');
            inputValue = inputValue.replace(/(\d{4})(?=\d)/g, '$1-');
            inputValue = inputValue.slice(0, 19);
            setSearchValue(inputValue);
        } else if (selectedOption == 'cin') {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/\D/g, '');
            inputValue = inputValue.slice(0, 8);
            setSearchValue(inputValue);
        } else if (selectedOption == 'codeCompte') {
            let inputValue = e.target.value;
            inputValue = inputValue.slice(0, 10);
            setSearchValue(inputValue);
        }
    };

    const validateInput = () => {
        if (searchValue.trim() === '') {
            message.error('Veuillez saisir une valeur de recherche');
            return false;
        }
        const selectedOption = selectBefore.props.defaultValue;
        if (selectedOption === 'codeCompte') {
            if (!searchValue.startsWith('CC') || searchValue.length !== 10) {
                message.error('Le Code Compte doit commencer par "CC" et comporter 10 caractères');
                return false;
            }
        } else if (selectedOption === 'cin') {
            if (!/^\d{8}$/.test(searchValue)) {
                message.error('Le CIN doit comporter 8 chiffres');
                return false;
            }
        } else if (selectedOption === 'ncrt') {
            if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(searchValue)) {
                message.error('Le Nº Carte doit comporter 16 chiffres');
                return false;
            }
        }
        return true;
    };

    const handleButtonClick = async () => {
        if (validateInput()) {
            try {
                const token = sessionStorage.getItem('userToken');
                const response = await axios.get('http://localhost:3000/client/check', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        [selectedOption]: searchValue
                    }
                });
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                const { data } = response;
                if (data && data.length > 0) {
                    const { CodeClient, CodeCompte } = data[0];
                    setClientProfileData({ codeClient: CodeClient, codeCompte: CodeCompte });
                    setShowClientProfile(true);
                } else {
                    // If data is null or empty, do not render the component
                    setShowClientProfile(false);
                    // Optionally, you can display a message to the user
                    message.info("Aucun client avec les informations d'identification données");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error, show error message, etc.
            }
        }
    };

    interface ILoginForm {
        codeclient: string;
    }

    const [form] = Form.useForm<ILoginForm>();

    const selectBefore = (
        <Select defaultValue={selectedOption} onChange={setSelectedOption} style={{ width: 120 }}>
            <Option value="codeCompte">Code Compte</Option>
            <Option value="cin">CIN</Option>
            <Option value="ncrt">Nº Carte</Option>
        </Select>
    );

    const dynamicItems: MenuItem[] = showClientProfile
        ? [
            ...items.slice(0, 1), // Keep the first item as it is
            {
                key: '2',
                label: 'Amen Client',
                icon: <DesktopOutlined />,
                children: [
                    getItem('Profil Client', '2-1')
                ]
            },
            ...items.slice(2) // Keep the rest of the items as they are
        ]
        : items;

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
                    defaultSelectedKeys={['2']} // Initial default selected keys
                    selectedKeys={selectedKeys} // Controlled selected keys
                    defaultOpenKeys={['2']} // Initial default open keys
                    mode="inline"
                    items={dynamicItems}
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
                    {showClientProfile && clientProfileData ? ( // Render ClientProfile if showClientProfile is true and clientProfileData is available
                        <ClientProfile data={clientProfileData} />
                    ) : (
                        <>
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
                                ]}
                            />
                            <Divider orientation="right"></Divider>
                            <Row justify="center" align="middle">
                                <Col md={10}>
                                    <Card className="login-card">
                                        <Form<ILoginForm>
                                            layout="vertical"
                                            form={form}
                                            requiredMark={false}
                                        >
                                            <Input
                                                addonBefore={selectBefore}
                                                placeholder="Rechercher un Client"
                                                allowClear
                                                value={searchValue}
                                                onChange={handleInputChange}
                                            />
                                            <Button onClick={handleButtonClick} type="primary" style={{ backgroundColor: '#1d7623', color: 'white', marginTop: "20px" }} size="large" htmlType="submit" block>
                                                Rechercher
                                            </Button>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
