import {
    Row,
    Col,
    Layout as AntdLayout,
} from "antd";

import { superballs } from 'ldrs'

superballs.register()


import "./styles.css";

export const DataLoading: React.FC = () => {

    return (
        <AntdLayout className="layout">
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh",
                }}
            >
                <Col xs={25}>
                    <div className="container">
                        <l-superballs
                            size="50"
                            speed="1.75"
                            color="#1d7623"
                        ></l-superballs>
                    </div>
                </Col>
            </Row>
        </AntdLayout>
    );
};
