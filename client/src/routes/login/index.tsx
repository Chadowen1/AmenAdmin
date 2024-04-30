import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import {
    Row,
    Col,
    Layout as AntdLayout,
    Card,
    Typography,
    Form,
    Input,
    Button,
    message,
} from "antd";
import "./styles.css";

const { Title } = Typography;

export interface ILoginForm {
    codeemploye: string;
    passkey: string; // Corrected property name
}

export const Login: React.FC = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm<ILoginForm>();
    const [loading, setLoading] = useState(false);
    const CardTitle = (
        <Title level={3} className="title">
            Connectez-vous
        </Title>
    );

    const onFinish = async (values: ILoginForm) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                const data = await response.json();
                const { token, CodeEmploye, Affectation } = data;
                localStorage.setItem('jwtToken', token); // Store token in local storage
                message.success('Login successful');
                setTimeout(() => {
                    navigate('/dashboard', { state: { CodeEmploye, Affectation } });
                }, 2000);
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('An error occurred while logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AntdLayout className="layout">
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh",
                }}
            >
                <Col xs={22}>
                    <div className="container">
                        <div className="imageContainer">
                            <img src="./Logo_Amen_Bank.png" alt="Amen Bank Logo" />
                        </div>
                        <Card title={CardTitle} className="login-card">
                            <Form<ILoginForm>
                                layout="vertical"
                                form={form}
                                onFinish={onFinish}
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="codeemploye"
                                    label="Code Employé"
                                    rules={[{ required: true }]}
                                >
                                    <Input size="large" placeholder="Code Employé" />
                                </Form.Item>
                                <Form.Item
                                    name="passkey"
                                    label="Clé d'Accès"
                                    rules={[{ required: true }]}
                                    style={{ marginBottom: "12px" }}
                                >
                                    <Input type="password" placeholder="●●●●●●●●" size="large" />
                                </Form.Item>
                                <Button type="primary" style={{ backgroundColor: '#1d7623', color: 'white', marginTop: "20px" }} size="large" htmlType="submit" block loading={loading}>
                                    Accéder
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </Col>
            </Row>
        </AntdLayout>
    );
};
