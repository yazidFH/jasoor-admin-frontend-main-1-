import { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Flex, Spin, message } from "antd";
import {
  AddNotification,
  ArticleCards,
  DeleteModal,
  ModuleTopHeading,
} from "../../components";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { DELETE_ARTICLE } from "../../graphql/mutation/mutations";
import { useMutation } from "@apollo/client";
import { t } from "i18next";

const ArticlePage = () => {
  const [deleteitem, setDeleteItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const refetchArticlesRef = useRef(null);
  const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE);

  useEffect(() => {
    if (location.state?.refetch && refetchArticlesRef.current) {
      refetchArticlesRef.current();
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = async () => {
    if (!deleteitem) return;
    try {
      await deleteArticle({ variables: { deleteArticleId: deleteitem } });
      messageApi.success(t("Article deleted successfully"));
      setDeleteItem(null);
      if (refetchArticlesRef.current) {
        refetchArticlesRef.current();
      }
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to delete article"));
    }
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={t("Articles")} />
            <Button
              aria-labelledby="Add New Article"
              type="primary"
              className="btnsave"
              onClick={() => navigate("/articles/add")}
            >
              <PlusOutlined /> {t("Add New Articles")}
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <ArticleCards
            setDeleteItem={setDeleteItem}
            onDelete={handleDelete}
            onRefetch={(fn) => {
              refetchArticlesRef.current = fn;
            }}
          />
        </Col>
      </Row>
      <DeleteModal
        visible={deleteitem}
        onClose={() => setDeleteItem(false)}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to delete this article?"
        )}
        type="danger"
        onConfirm={(refetch) => handleDelete(refetch)}
        loading={deleting}
      />
    </>
  );
};

export { ArticlePage };
