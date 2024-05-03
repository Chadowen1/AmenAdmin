import {
    Row,
    Col,
    Layout as AntdLayout,
} from "antd";

// Manually defined
import { bouncy } from 'ldrs'

bouncy.register()


import "./styles.css";

export const Loading: React.FC = () => {

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
                        <l-bouncy
                            size="45"
                            speed="1.75"
                            color="#1d7623"
                        ></l-bouncy>
                    </div>
                </Col>
            </Row>
        </AntdLayout>
    );
};
