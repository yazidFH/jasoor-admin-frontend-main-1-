import { PlusOutlined } from "@ant-design/icons";
import { Row, Col, Space, Button, Typography } from "antd";
export const ModuleTopHeading = ({ name, onClick, level }) => {
  return (
    <Row>
      <Col span={24}>
        <Space className="align-center">
          <Typography.Title level={level} className="my-0 fw-500">
            {name}
          </Typography.Title>
          {onClick ? (
            <Button
              className="my-0"
              type="primary"
              shape={"circle"}
              size="small"
              classNames={"brand-bg text-white"}
              icon={<PlusOutlined />}
              onClick={onClick}
              aria-labelledby="plus button"
            />
          ) : (
            <></>
          )}
        </Space>
      </Col>
    </Row>
  );
};
