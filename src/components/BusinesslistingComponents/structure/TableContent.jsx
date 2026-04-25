import { Table } from "antd";

const TableContent = ({ columns, data, x = 500 }) => {
  return (
    <Table
      size="large"
      columns={columns}
      dataSource={data}
      className="pagination table table-cs"
      showSorterTooltip={false}
      scroll={{ x: x }}
      rowHoverable={false}
      pagination={false}
    />
  );
};

export { TableContent };
