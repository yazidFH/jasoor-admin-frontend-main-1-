// import { Row, Col, Form, Space, Flex } from "antd";
// import { useEffect } from "react";
// import { MyInput, MySelect } from "../../Forms";
// import { MinusCircleFilled } from "@ant-design/icons";
// import { ModuleTopHeading } from "../../Pagecomponents";
// import { yearOp } from "../../../data";

// const FormReplicate = ({ dayKey, title, form }) => {
//   useEffect(() => {
//     const fields = form.getFieldValue(dayKey) || [];
//     if (fields.length === 0) {
//       form.setFieldsValue({
//         [dayKey]: [
//           {
//             assetName: null,
//             noItems: null,
//             purchaseYear: null,
//             price: null,
//           },
//         ],
//       });
//     }
//   }, [dayKey, form]);
//   return (
//     <Form.List name={dayKey}>
//       {(fields, { add, remove }) => (
//         <Space direction="vertical" className="w-100">
//           <Row gutter={[16, 16]} align="middle">
//             <Col span={24}>
//               <ModuleTopHeading level={5} name={title} onClick={() => add()} />
//             </Col>
//             <Col span={24}>
//               {fields.map(({ key, name }) => (
//                 <Row key={key} gutter={[16, 0]} align="middle" className="mb-1 bg-light-white p-2 rounded-8 mb-2">
//                   <Col span={24}>
//                     <Flex justify="end">
//                       <MinusCircleFilled className="text-red" onClick={() => remove(name)} />
//                     </Flex>
//                   </Col>
//                   <Col xs={24} sm={24} md={24} lg={6}>
//                     <MyInput
//                       label="Asset Name"
//                       name={[name, "assetName"]}
//                       placeholder="Write asset name"
//                       required
//                       message="Please enter asset name"
//                     />
//                   </Col>

//                   <Col xs={24} sm={24} md={24} lg={6}>
//                     <MyInput
//                       label="Number of items"
//                       name={[name, "noItems"]}
//                       placeholder="Enter quantity"
//                       required
//                       message="Please enter quantity"
//                     />
//                   </Col>

//                   <Col xs={24} sm={24} md={24} lg={6}>
//                     <MySelect
//                       label="Purchase Year"
//                       name={[name, "purchaseYear"]}
//                       placeholder="Choose purchase year"
//                       required
//                       message="Please enter purchase year"
//                       options={yearOp}
//                     />
//                   </Col>

//                   <Col xs={24} sm={24} md={24} lg={6}>
//                     <MyInput
//                       label="Price"
//                       name={[name, "price"]}
//                       required
//                       message="Please enter price"
//                       placeholder="Enter price"
//                       addonBefore={<img src="/assets/icons/reyal-g.png" width={14} />}
//                       className="w-100 bg-white"
//                     />
//                   </Col>
//                 </Row>
//               ))}
//             </Col>
//           </Row>
//         </Space>
//       )}
//     </Form.List>
//   );
// };

// export { FormReplicate };

import { Row, Col, Form, Space, Flex } from "antd";
import { useEffect } from "react";
import { MyInput, MySelect } from "../../Forms";
import { MinusCircleFilled } from "@ant-design/icons";
import { ModuleTopHeading } from "../../PageComponents";

const FormReplicate = ({
  dayKey,
  title,
  form,
  fieldsConfig = [],
  allowEmpty = false,
}) => {
  useEffect(() => {
    const fields = form.getFieldValue(dayKey) || [];
    // Only auto-insert a default row when empty if allowEmpty is false
    if (!allowEmpty && fields.length === 0) {
      const defaultItem = {};
      fieldsConfig.forEach((f) => {
        defaultItem[f.name] = null;
      });
      form.setFieldsValue({ [dayKey]: [defaultItem] });
    }
  }, [dayKey, form, fieldsConfig, allowEmpty]);

  return (
    <Form.List name={dayKey}>
      {(fields, { add, remove }) => (
        <Space direction="vertical" className="w-100">
          <Row gutter={[16, 16]} align="middle">
            <Col span={24}>
              <ModuleTopHeading level={5} name={title} onClick={() => add()} />
            </Col>
            <Col span={24}>
              {fields.map(({ key, name }) => (
                <Row
                  key={key}
                  gutter={[16, 0]}
                  align="middle"
                  className="mb-1 bg-light-white p-2 rounded-8 mb-2"
                >
                  <Col span={24}>
                    <Flex justify="end">
                      <MinusCircleFilled
                        className="text-red"
                        onClick={() => remove(name)}
                      />
                    </Flex>
                  </Col>

                  {fieldsConfig.map((field, index) => {
                    const evaluatedValidator =
                      typeof field.validator === "function"
                        ? field.validator({
                            getFieldValue: form.getFieldValue,
                            index: name,
                            dayKey,
                            form,
                          })
                        : field.validator;

                    return (
                      <Col
                        key={index}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={field.col || 6}
                      >
                        {field.type === "input" ? (
                          <MyInput
                            label={field.label}
                            name={[name, field.name]}
                            placeholder={field.placeholder}
                            required={field.required}
                            message={field.message}
                            addonBefore={field.addonBefore}
                            className={field.className || ""}
                            validator={evaluatedValidator}
                          />
                        ) : field.type === "select" ? (
                          <MySelect
                            label={field.label}
                            name={[name, field.name]}
                            placeholder={field.placeholder}
                            required={field.required}
                            message={field.message}
                            options={field.options || []}
                            validator={evaluatedValidator}
                          />
                        ) : null}
                      </Col>
                    );
                  })}
                </Row>
              ))}
            </Col>
          </Row>
        </Space>
      )}
    </Form.List>
  );
};

export { FormReplicate };
