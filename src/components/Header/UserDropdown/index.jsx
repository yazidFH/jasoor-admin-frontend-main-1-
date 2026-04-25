import { useContext } from "react";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Spin,
  Space,
  Typography,
  message,
  Avatar,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../../../graphql/mutation/login";
import { ME } from "../../../graphql/query";
import { AuthContext } from "../../../context/AuthContext";
import { getUserId } from "../../../shared/tokenManager";
import { client } from "../../../config";
import { t } from "i18next";

const UserDropdown = () => {
  const userId = getUserId();
  const { logout: contextLogout } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();

  const { data } = useQuery(ME, {
    variables: { getUserId: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const [logoutMutation, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      client.resetStore();
      contextLogout();
    },
    onError: (err) => {
      // Even if server logout fails, clean up locally
      console.error("Server logout error:", err);
      messageApi.error(t("Logout error, but will clear local session"));
      contextLogout();
    },
  });

  const dropdownContent = (
    <Card className="radius-12 shadow-c card-cs">
      <Space direction="vertical">
        <Flex align="center" gap={10}>
          <Avatar
            size={40}
            className="fs-16 text-white fw-bold brand-bg textuppercase"
          >
            {data?.getUser?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Flex vertical gap={1}>
            <Typography.Text strong className="fs-13">
              {data?.getUser?.name.charAt(0).toUpperCase() +
                data?.getUser?.name.slice(1)}
            </Typography.Text>
            <Typography.Text className="text-gray fs-13">
              {data?.getUser?.email}
            </Typography.Text>
          </Flex>
        </Flex>
        <Button
          className="btnsave w-100"
          type="primary"
          loading={loading}
          onClick={logoutMutation}
          aria-labelledby="logout"
        >
          {t("Logout")}
        </Button>
      </Space>
    </Card>
  );

  return (
    <>
      {contextHolder}
      <div>
        <Dropdown overlay={dropdownContent} trigger={["click"]} className="p-0">
          <Flex align="center" gap={5}>
            <Flex vertical gap={0} align="end">
              <Typography.Text strong className="fs-12">
                {data?.getUser?.name.charAt(0).toUpperCase() +
                  data?.getUser?.name.slice(1) || "N/A"}
              </Typography.Text>
              <Typography.Text className="text-gray fs-12">
                {data?.getUser?.role?.name || "N/A"}
              </Typography.Text>
            </Flex>
            <Avatar
              size={40}
              className="fs-16 text-white fw-bold brand-bg textuppercase"
            >
              {data?.getUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Flex>
        </Dropdown>
        {/* <SwitchAccount 
          visible={switchAccount}
          onClose={()=>{setSwitchAccount(false)}}
        /> */}
      </div>
    </>
  );
};

export { UserDropdown };
