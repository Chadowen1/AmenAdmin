import React from "react";
import {
    Row,
    Col,
    Layout as AntdLayout,
    Card,
    Typography,
    Form,
    Input,
    Button,
} from "antd";
import "./styles.css";

const { Title } = Typography;

export interface ILoginForm {
    codeemploye: string;
    password: string;
}

export const Login: React.FC = () => {
    const [form] = Form.useForm<ILoginForm>();

    const CardTitle = (
        <Title level={3} className="title">
            Connectez-vous
        </Title>
    );

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
                                onFinish={(values) => {
                                    console.log('Finish:', values);
                                }}
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
                                <Button type="primary" style={{ backgroundColor: '#1d7623', color: 'white', marginTop: "20px" }} size="large" htmlType="submit" block>
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