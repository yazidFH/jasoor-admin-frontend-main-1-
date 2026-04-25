import { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Typography, Spin, Flex } from "antd";
import { ModuleTopHeading } from "../../components";
import { GET_ALERTS } from "../../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { t } from "i18next";
import Cookies from "js-cookie";

const { Text, Title } = Typography;
const Alerts = () => {
  const userId = Cookies.get("userId");
  const LIMIT = 10;

  const [groups, setGroups] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loaderRef = useRef(null);

  const [loadAlerts, { called, loading, fetchMore }] = useLazyQuery(
    GET_ALERTS,
    {
      fetchPolicy: "network-only",
      onCompleted: (res) => {
        const fetchedGroups = res?.getAlerts?.groups || [];
        const total = res?.getAlerts?.count || 0;
        setGroups(fetchedGroups);
        setOffset(fetchedGroups.length);
        setHasMore(fetchedGroups.length < total);
      },
    }
  );

  // trigger initial load when userId becomes available
  useEffect(() => {
    if (!userId) return;
    if (!called) {
      loadAlerts({ variables: { userId, offset: 0, limit: LIMIT } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      // if the lazy query hasn't been called yet, trigger initial load
      if (!called) {
        await loadAlerts({ variables: { userId, offset: 0, limit: LIMIT } });
        return;
      }

      const res = await fetchMore({
        variables: { userId, offset: offset, limit: LIMIT },
      });
      const newGroups = res?.data?.getAlerts?.groups || [];
      const total = res?.data?.getAlerts?.count || 0;
      setGroups((prev) => [...prev, ...newGroups]);
      setOffset((prev) => prev + newGroups.length);
      const newHasMore = offset + newGroups.length < total;
      setHasMore(newHasMore);
    } catch (err) {
      console.error("fetchMore error", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // IntersectionObserver to trigger loadMore
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "200px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef.current, hasMore, loading]);

  if (loading && groups.length === 0) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ModuleTopHeading level={4} name={t("Alerts")} />
        </Col>
        <Col span={24}>
          <Card className="overflow-style">
            {groups?.map((day, index) => (
              <Flex vertical className="mt-2" key={`${day.time}-${index}`}>
                <Text>{new Date(day.time).toLocaleDateString()}</Text>
                {day?.notifications?.map((notif) => (
                  <Flex vertical className="mt-2 ml-15" gap={4} key={notif.id}>
                    <Flex justify="space-between">
                      <Title level={5} className="m-0 fw-500">
                        {t(notif?.name || "Notification")}
                      </Title>
                      <Text className="text-gray fs-12">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Flex>
                    <div
                      className="text-justify text-gray fs-14"
                      dangerouslySetInnerHTML={{ __html: notif.message }}
                    />
                  </Flex>
                ))}
              </Flex>
            ))}

            {/* loader sentinel */}
            <div ref={loaderRef} style={{ height: 1 }} />

            {loadingMore && (
              <Flex justify="center" className="mt-2">
                <Spin />
              </Flex>
            )}

            {!hasMore && groups.length === 0 && (
              <Text className="text-gray">{t("No alerts found")}</Text>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export { Alerts };
