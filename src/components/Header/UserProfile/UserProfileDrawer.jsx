import { useState } from "react"
import { Drawer, Button } from "antd"
import { t } from "i18next"

const UserProfileDrawer= ({visible, onClose})=>{

    const [loading, setLoading]= useState(false)

    // const logout = () => {
    //     setLoading(true)
    //     const {userToken}= checkAuthorization()
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", userToken)
    //     var requestOptions = {
    //       method: 'GET',
    //       headers: myHeaders,
    //       redirect: 'follow'
    //     }
    //     fetch(domainUrl + '/logout', requestOptions)
    //     .then(response => response.json())
    //     .then(result => {
    //     if (result?.success)
    //         {
    //             localStorage.clear()
    //             window.location.href = '/'
    //         }
    //     else
    //         throw 'error'
    //     })
    //     .catch(() => {
    //         setLoading(false)
    //         localStorage.clear()
    //         window.location.href = '/'
    //     })
    // }

    return (
        <Drawer
            title={t('Profile')}
            onClose={onClose}
            open={visible}
            width={400}
            footer={
                <Button  
                    block
                    type="primary"
                    className="w-100 btnsave"
                    loading={loading}
                    // onClick={logout}
                    aria-labelledby='logout'
                >
                    {t("Logout")}
                </Button>
            }
        >
            
        </Drawer>
    )
}
export default UserProfileDrawer