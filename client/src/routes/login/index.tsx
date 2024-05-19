import React, { useState } from "react";
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

import { Loading } from "../../components/Loading/Loading";

import "./styles.css";

const { Title } = Typography;

export interface ILoginForm {
    codeemploye: string;
    passkey: string; // Corrected property name
}

export const Login: React.FC = () => {
    const [form] = Form.useForm<ILoginForm>();
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);
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
                const { token, CodeEmploye } = data;
                // Fetch data using /data endpoint
                const dataResponse = await fetch(`http://localhost:3000/employe/data?codeEmploye=${CodeEmploye}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send JWT token in the header
                    },
                });
                if (dataResponse.ok) {
                    const userData = await dataResponse.json();
                    userData[0].CodeEmploye = CodeEmploye;
                    // Store data in session along with token
                    sessionStorage.setItem('userToken', token);
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                    setLoadingScreen(true);
                } else {
                    const errorData = await dataResponse.json();
                    message.error(errorData.message || 'Data retrieval failed');
                }
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'La connexion a échoué');
            }
        } catch (error) {
            message.error('Une erreur s\'est produite lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    if (loadingScreen) {
        return <Loading />;
    }

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
                                    label="Code employé"
                                    rules={[{ required: true }]}
                                >
                                    <Input size="large" placeholder="Code employé" />
                                </Form.Item>
                                <Form.Item
                                    name="passkey"
                                    label="Clé d'accès"
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
