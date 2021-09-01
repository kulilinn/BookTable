import React from 'react';
import {Form, Button, Select, DatePicker, Space} from 'antd';
import styles from './ListFilter.less';
import PropTypes from 'prop-types';
import {IconExpandIcon} from '@/resourceUtils/tssCustomIcon';
const {RangePicker} = DatePicker;
const {Option} = Select;

export const ListFilter = (props) => {
  const {title, propsAllSelectOfOptionConfig} = props;
  // antd's form  ref object
  const formRef = React.createRef();
  // select's rules config
  const selectConfig = {
    rules: [{required: false, message: 'Please select'}],
  };
  // all select'Option config
  const allSelectOfOptionConfig = propsAllSelectOfOptionConfig ?
    propsAllSelectOfOptionConfig :
    [
      {
        props: {
          label: '',
          name: 'Date',
          rules: [{required: false}],
        },
        node: <RangePicker format={'YYYY/MM/DD'} />,
      },
      {
        defVa: 'All',
        props: {
          label: 'Member Tier',
          name: 'MemberTier',
          rules: selectConfig.rules,
        },
        option: [
          {name: 'All', value: 'All'},
          {name: 'Green', value: 'Green'},
        ],
      },
      {
        defVa: 'All',
        props: {
          label: 'Status',
          name: 'Status',
          rules: selectConfig.rules,
        },
        option: [
          {name: 'All', value: 'All'},
          {name: 'Active', value: 'Active'},
          {name: 'Suspend', value: 'Suspend'},
          {name: 'Dormant', value: 'Dormant'},
        ],
      },
      {
        defVa: 'All',
        props: {
          label: 'Nationality',
          name: 'Nationality',
          rules: selectConfig.rules,
        },
        option: [
          {name: 'All', value: 'All'},
          {name: 'Malaysian', value: 'Malaysian'},
          {name: 'Singaporean', value: 'Singaporean'},
        ],
      },
      {
        defVa: 'All',
        props: {
          label: 'Email Verified',
          name: 'EmailVerified',
          rules: selectConfig.rules,
        },
        option: [
          {name: 'All', value: 'All'},
          {name: 'Yes', value: 'Yes'},
          {name: 'No', value: 'No'},
        ],
      },
    ];

  /** form Initialize the Data */
  const initialValuesOfForm = {};
  // Dynamic organization form initialize the Data(动态组织form表单的初始化信息)
  allSelectOfOptionConfig.forEach((itme) => {
    if (itme.defVa) {
      initialValuesOfForm[itme.props.name] = itme.defVa;
    }
  });

  /**
   *filter form submit
   *
   * @param {*} values filter data
   */
  const onFinish = (values) => {
    const {onSubmitSuccess, setFilterTooltipVisible} = props;
    if (typeof onSubmitSuccess === 'function') {
      onSubmitSuccess(values);
    } else {
      // Date transformation format (时间类型转换格式)
      values.Date = values.Date ?
        [values['Date'][0].format('MM/DD/YYYY'), values['Date'][1].format('MM/DD/YYYY')] :
        values.Date;
      console.log('Success:', values);
    }
    setFilterTooltipVisible(false);
  };

  /**
   *Reset from
   *
   */
  const onReset = () => {
    formRef.current.resetFields();
  };
  return (
    <div className={styles.cont}>
      <p className={styles.cont_title}>{title}</p>
      <Form
        ref={formRef}
        name="basic"
        layout="vertical"
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{...initialValuesOfForm}}
      >
        {allSelectOfOptionConfig.map((itme, idx) => {
          return (
            <Form.Item key={idx} {...itme.props}>
              {itme.node ? (
                itme.node
              ) : (
                <Select allowClear={false} suffixIcon={<IconExpandIcon />}>
                  {itme.option.map((ite, iidx) => {
                    return (
                      <Option key={iidx} value={ite.value}>
                        {ite.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          );
        })}
        <Form.Item wrapperCol={{offset: 9, span: 15}}>
          <Space>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
ListFilter.propTypes = {
  title: PropTypes.string,
  setFilterTooltipVisible: PropTypes.func,
  propsAllSelectOfOptionConfig: PropTypes.array,
  onSubmitSuccess: PropTypes.func,
  PopoverVisible: PropTypes.func,
  PopoerHide: PropTypes.func,
};
export default ListFilter;
