import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Breadcrumb, Flex, Tooltip, Dropdown, Divider, Card, Form, Col, Row, Select, Input, Space, message } from 'antd';

import { Logo } from "../../components/Logo/Logo";
import HeaderNav from './HeaderNav.tsx';
import "./styles.css";

const { Content, Sider } = Layout;
const { Option } = Select;

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
    getItem('Se déconnecter', '9', <LogoutOutlined />),
];

export const AmenClient: React.FC = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 769 });
    const [navFill, setNavFill] = useState(false);
    const [zones, setZones] = useState<{ CodeZone: string; Zone: string }[]>([]);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [gouvernerats, setGouvernerats] = useState<{ CodeGouvernerat: string; Gouvernerat: string }[]>([]);
    const [selectedGouvernerat, setSelectedGouvernerat] = useState<string | null>(null);
    const [agences, setAgences] = useState<{ CodeAgence: string; Agence: string }[]>([]);
    const [selectedAgence, setSelectedAgence] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedOption, setSelectedOption] = useState("codeCompte");

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

    useEffect(() => {
        fetch('http://localhost:3000/agence/zones')
            .then(response => response.json())
            .then(data => {
                setZones(data);
            })
            .catch(error => {
                console.error('Error fetching zones:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedZone) {
            fetch(`http://localhost:3000/agence/gouvernerats?codeZone=${selectedZone}`)
                .then(response => response.json())
                .then(data => {
                    setGouvernerats(data);
                })
                .catch(error => {
                    console.error('Error fetching gouvernerats:', error);
                });
        }
    }, [selectedZone]);

    useEffect(() => {
        if (selectedGouvernerat) {
            fetch(`http://localhost:3000/agence/data?codeGouvernerat=${selectedGouvernerat}`)
                .then(response => response.json())
                .then(data => {
                    setAgences(data);
                })
                .catch(error => {
                    console.error('Error fetching agences:', error);
                });
        }
    }, [selectedGouvernerat]);

    const handleZoneChange = (value) => {
        setSelectedZone(value);
        setSelectedGouvernerat(null);
        setSelectedAgence(null);
    };

    const handleGouverneratChange = (value) => {
        setSelectedGouvernerat(value);
        setSelectedAgence(null);
    };

    const handleAgenceChange = (value) => {
        setSelectedAgence(value);
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
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
        }
        
        return true;
    };
    

    const handleButtonClick = async () => {
        if (validateInput()) {
            let apiUrl = 'http://localhost:3000/client/data?';
    
            // Add search value and selected option
            apiUrl += `${selectedOption}=${searchValue}`;
    
            // Add selected zone, gouvernerat, and agence if available
            if (selectedZone) {
                apiUrl += `&codeZone=${selectedZone}`;
            }
            if (selectedGouvernerat) {
                apiUrl += `&codeGouvernerat=${selectedGouvernerat}`;
            }
            if (selectedAgence) {
                apiUrl += `&codeAgence=${selectedAgence}`;
            }
    
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
    
                // Navigate to the client profile page
                navigate('/clientprofile', { state: { data } });
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
        <Select defaultValue={selectedOption} onChange={setSelectedOption}>
            <Option value="codeCompte">Code Compte</Option>
            <Option value="cin">CIN</Option>
        </Select>
    );

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
                <Menu defaultSelectedKeys={['2']} mode="inline" items={items} />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: '100vh' }}>
                <HeaderNav
                    style={{
                        padding: '0 2rem 0 0',
                        background: navFill ? 'none' : 'rgba(222, 248, 227, 1)',
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
                        ]}
                    />
                    <Divider orientation="right"></Divider>
                    <Row justify="center" align="middle">
                        <Col md={10}>
                            <Card className="login-card">
                                <Form<ILoginForm>
                                    layout="vertical"
                                    form={form}
                                    onFinish={(values) => {
                                        console.log('Finish:', values);
                                    }}
                                    requiredMark={false}
                                >
                                    <Input
                                        addonBefore={selectBefore}
                                        placeholder="Rechercher un Client"
                                        allowClear
                                        value={searchValue}
                                        onChange={handleInputChange}
                                    />
                                    <Space style={{ marginTop: '1rem' }} align="center">
                                        <Select
                                            style={{ width: 90 }}
                                            value={selectedZone}
                                            onChange={handleZoneChange}
                                            options={zones.map(zone => ({ label: zone.Zone, value: zone.CodeZone }))}
                                        />
                                        <Select
                                            style={{ width: 'auto' }}
                                            value={selectedGouvernerat}
                                            onChange={handleGouverneratChange}
                                            options={gouvernerats.map(gouvernerat => ({ label: gouvernerat.Gouvernerat, value: gouvernerat.CodeGouvernerat }))}
                                        />
                                        <Select
                                            style={{ width: 'auto' }}
                                            value={selectedAgence}
                                            onChange={handleAgenceChange}
                                            options={agences.map(agence => ({ label: agence.Agence, value: agence.CodeAgence }))}
                                        />
                                    </Space>
                                    <Button onClick={handleButtonClick} type="primary" style={{ backgroundColor: '#1d7623', color: 'white', marginTop: "20px" }} size="large" htmlType="submit" block>
                                        Rechercher
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};
