import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Modal, Row, Space, Typography } from 'antd'
import { MyInput } from '../../Forms'


const {Text} = Typography
const SwitchAccount = ({visible , onClose})=> {
    const [form] = Form.useForm()
  
    const addAccount = () => {

    }
  return (
    <div>
        <Modal
            
            title={null} 
            className='shadow-c modal-cs'  
            open={visible} 
            onOk={onClose} 
            onCancel={onClose} 
            closeIcon={false}
            centered 
            footer={null}
        >
            <Flex align='center' justify='space-between' className='header-modal'>
                <Text strong>Switch Account</Text>
                <Button aria-labelledby='Close' className='bg-transparent border0 p-0 ' onClick={onClose}>
                    <CloseOutlined  className='text-gray'/>
                </Button>
            </Flex>
            <Form
                form={form}
                layout="vertical"
                initialValues={true}
                // onFinish={onFinish}
                requiredMark={false}
                className='content-modal'
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Space className='w-100 space-cs'>
                            <MyInput
                                label="Account number"
                                size='large'
                                name='accountNo'
                                className='w-100'
                                value={form.getFieldValue('accountNo') || ''}
                            />
                            <Button 
                                className='pad-x fs-13 border-gray text-black h-40 margintop-5' 
                                onClick={addAccount}
                                aria-labelledby='Add Account'
                            >
                                Add Account
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>
  )
}

export {SwitchAccount}