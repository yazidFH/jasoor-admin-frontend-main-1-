import { useState } from "react"
import { Space, Typography, Avatar, Flex} from "antd"
import UserProfileDrawer from "./UserProfileDrawer"
const { Text }= Typography

export const UserProfile = () => {
    const [visible, setVisible]= useState(false)
    return (
        <>
          <Space 
            className="cursor"
            onClick={()=> setVisible(true)}
            size={10}
          >
            <Avatar
              size={36}
              icon={<img src="/assets/images/av-1.png" alt="user image" fetchPriority="high" />}
            />
            <Flex vertical gap={0}>
              <Text className="fs-12" strong>
                Mark Ferdinand
              </Text>
              <Text className="fs-10 text-gray">
                mkferdinand@gmail.com
              </Text>
            </Flex>
          </Space>
          <UserProfileDrawer
            visible={visible}
            onClose={()=> setVisible(false)}
          />
        </>
    )
}