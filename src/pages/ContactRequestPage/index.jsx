import { useState } from 'react';
import { Row, Col } from 'antd';
import { ContactFormSentPending, ContactRequestTable, ModuleTopHeading } from '../../components';
import { t } from 'i18next';

const ContactRequestPage = () => {

    const [ visible, setVisible ] = useState(false)
    const [ sendview, setSendView ] = useState(false)
    const [ viewitem, setViewItem ] = useState(null)

    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name={t('Contact Requests')} />
                </Col>
                <Col span={24}>
                    <ContactRequestTable 
                        {...{setVisible,setSendView,setViewItem}}
                    />
                </Col>
            </Row>
            <ContactFormSentPending 
                visible={visible}
                sendview={sendview}
                viewitem={viewitem}
                onClose={()=>{setVisible(false);setSendView(false);setViewItem(null)}}
            />

        </>
    )
}

export { ContactRequestPage }; 