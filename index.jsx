import React, {Component, useState} from 'react';
import {Table, Dropdown, Menu, Modal, ConfigProvider, List, Empty} from 'antd';
import styles from './index.less';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import TableTool from './TableTool';
import PropTypes from 'prop-types';
import {useEffect} from 'react';

const {confirm} = Modal;
/**
 *table empty(表格没有数据时)
 *
 * @param {*} props
 * @return {*}
 */
const CustomizeRenderEmpty = (props) => {
  const {setIsSearch} = props;
  const [isModalVisible, setIsModalVisible] = useState(true);
  const data = [];
  for (let i = 0; i <= 10; i++) {
    data.push(<>&nbsp;</>);
  }
  useEffect(() => {
    return () => {
      setIsSearch(false);
    };
  }, []);
  return (
    <div className={styles.book_tabale_emptyCont}>
      <List dataSource={data} renderItem={(item) => <List.Item>{item}</List.Item>} />
      <Modal
        footer={null}
        visible={isModalVisible}
        mask={false}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <p className={styles.book_tabale_emptyCont_title}>
          <b>Notification</b>
        </p>
        <p>No results match your search criteria.</p>
      </Modal>
    </div>
  );
};
CustomizeRenderEmpty.propTypes = {
  setIsSearch: PropTypes.func,
};
const NodataRenderEmpty = () => {
  return (
    <div className={styles.book_tabale_emptyCont}>
      <Empty description={'No data'} />
    </div>
  );
};

/**
 *confirm弹窗
 *
 * @param {String} title 标题
 * @param {String} cont  内容
 * @param {function} callBack 点击确认后的回调函数
 */
const showConfirm = (title, cont, callBack) => {
  confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    content: cont,
    onOk() {
      if (typeof callBack === 'function') {
        callBack();
      }
    },
  });
};
/**
 *
 *
 * @class BookTable
 * @extends {Component}
 */
class BookTable extends Component {
  /**
   * Creates an instance of BookTable.
   * @param {*} props
   * @memberof BookTable
   */
  constructor(props) {
    super(props);
    this.state = {
      paginationProps: this.props.paginationProps ?
        {
          total: props.data?.total ? props.data?.total : props.data?.length,
          ...this.props.paginationProps,
          onChange: (pagination, filters) => {
            this.setState({tableLoad: true, isTurnPage: true}, () => {
              if (typeof this.props.paginationProps.onChange === 'function') {
                this.props.paginationProps.onChange(pagination, filters);
              }
            });
          },
        } :
        {},
      isTurnPage: false,
      tableLoad: false,
      selectedRowKeys: [], // 当前选中的数据
      selectedRows: [], // 当前选中的数据
      // management TableTool>Apply btn
      isDisabledApplyBtn: true,
      tableHight:
        document.documentElement.clientHeight - 370 + (this.props.paginationProps ? 0 : 65),
      tableToolBatchOperationSelected: '',
      isSearch: false,
    };
    // 表格操作栏点击事件(暂时未使用)
    this.handleMenuItemClick = (e) => {
      showConfirm('Do you want to ' + e.key + ' these items?', '', () => {
        alert(e.key);
      });
    };
    // 表格改变选中事件
    this.onSelectChange = (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRows);
      const {btnsRulesObj} = this.props;
      const {tableToolBatchOperationSelected} = this.state;
      const that = this;
      this.setState({selectedRows: selectedRows});
      this.setState({selectedRowKeys}, () => {
        that.setState({isDisabledApplyBtn: selectedRowKeys.length <= 0});
        if (btnsRulesObj && typeof btnsRulesObj.batchOperationRules === 'function') {
          this.setState({
            isDisabledApplyBtn:
              selectedRowKeys.length <= 0 ||
              btnsRulesObj.batchOperationRules(tableToolBatchOperationSelected, selectedRows),
          });
        } else {
          that.setState({isDisabledApplyBtn: selectedRowKeys.length <= 0});
        }
      });
    };

    /**
     * list size change to
     *
     * @param {*} actionItem
     */
    this.listSizeChange = (actionItem) => {
      const that = this;
      that.setState({tableLoad: true});
      /* change list size */
      // 使用本地静态数据
      that.setState(
          {
            paginationProps: {
              ...that.state.paginationProps,
              pageSize: actionItem.size,
              current: 1,
            },
          },
          () => {
          // list load animation
            that.setState({tableLoad: false});
          },
      );
      if (typeof that.state.paginationProps.onChange === 'function') {
        // 当调用api服务接口时
        that.state.paginationProps.onChange(1, actionItem.size);
      }
    };

    // batch operation delete or action , suspend
    this.batchApplyOp = () => {
      if (this.state.selectedRowKeys.length <= 0) {
        return;
      }
    };

    // 回调btn的点击事件 主要是为了检查是否传递点击事件
    this.onClikMenuItem = (e, rowItem, btn) => {
      if (typeof btn.onClick === 'function') {
        btn.onClick(e, rowItem);
      }
    };

    // 下拉改变时时候Apply是否可以改变
    this.setIsDisabledApplyBtn = (func, selectAction) => {
      const {selectedRows} = this.state;
      this.setState({
        isDisabledApplyBtn: selectedRows.length <= 0 || func(selectAction, selectedRows),
      });
    };

    this.onTableSelectChangeByTableTool = (selectAction) => {
      this.setState({tableToolBatchOperationSelected: selectAction});
    };

    // 当窗口改变时
    this.screenChange = () => {
      this.setState({
        tableHight:
          document.documentElement.clientHeight - 370 + (this.props.paginationProps ? 0 : 65),
      });
    };

    /* 数据加载前 对data进行处理 */
    this.loadDataSource = (data) => {
      const {onLoadBefore} = this.props;
      const ret = data && data.data ? data.data : data;

      if (typeof onLoadBefore === 'function') {
        return onLoadBefore(data, this.state.paginationProps, this.setState);
      }
      return ret;
    };

    this.setIsSearch = (onTurn) => {
      this.setState({isSearch: onTurn});
    };
  }

  /**
   *当窗口分辨率改变时 需要动态修改 table的高度
   *
   * @memberof BookTable
   */
  componentDidMount() {
    window.addEventListener('resize', this.screenChange);
  }
  /**
   *
   *
   * @param {*} props
   * @param {*} state
   * @param {*} snapshot
   * @memberof BookTable
   */
  componentDidUpdate(props, state, snapshot) {
    const {data} = this.props;
    // 服务接口请求数据的方式
    if (data?.total && this.state.paginationProps.total !== data?.total) {
      this.setState({
        tableLoad: false,
        paginationProps: {
          ...this.state.paginationProps,
          total: data.total,
        },
      });
    } else if (data && !data?.total && this.state.tableLoad) {
      // 加载静态数据的方式
      this.setState({
        tableLoad: false,
      });
    } else if (this.state.isTurnPage && this.state.tableLoad) {
      // 翻页的情况
      this.setState({
        tableLoad: false,
        isTurnPage: false,
      });
    } else if (!data && !this.state.tableLoad) {
      // 当没有数据时开启动画
      this.setState({
        tableLoad: true,
      });
    }
  }

  /**
   *卸载组件时 清楚 分辨率改变时触发事件
   *
   * @memberof BookTable
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.screenChange);
  }

  /**
   *
   * BookTable
   * @return {*} dom
   * @memberof BookTable
   */
  render() {
    const {
      tcolumns,
      data,
      btns,
      btnsRulesObj,
      listSizes,
      roleName,
      tableToolObj,
      batchOperationConfig,
      scrollConfigObj,
      tableToolNode,
      expandable,
      scroll,
      rowSelectionConfig,
      rowKey,
      tableSortConfig,
    } = this.props;
    const {tableLoad, isDisabledApplyBtn, tableHight, selectedRowKeys, isSearch} = this.state;
    // 对使用者的自定义按钮渲染 btns  rowItem:table每一行的数据
    const MoreBtn = (props) => {
      let loadBtns = [...btns];
      // 当有条件过滤按钮数组时
      if (btnsRulesObj && typeof btnsRulesObj.btnsFilterRules === 'function') {
        loadBtns = btnsRulesObj.btnsFilterRules(btns, props.rowItem);
      }
      return (
        <Dropdown
          placement="bottomLeft"
          overlay={
            <Menu className={styles.moreBtns}>
              {loadBtns.map((btn) => {
                return (
                  <Menu.Item
                    key={btn.key}
                    onClick={() => {
                      this.onClikMenuItem(this, props.rowItem, btn);
                    }}
                    icon={btn.icon}
                    className={styles.moreBtnitem}
                  >
                    {btn.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
        >
          <a>
            <span className={styles.moreBtnTitle}>···</span>
          </a>
        </Dropdown>
      );
    };
    // 合并使用的者自定义的columns以及使用者使用的操作按钮
    const columns =
      btns && btns.length > 0 ?
        [
          ...tcolumns,
          {
            title: '',
            className: `contcolumn ${btns[0].className ? btns[0].className : 'opcolumn'}`,
            key: 'operation',
            fixed: btns[0].fixed||typeof(btns[0].fixed)==='boolean' ? btns[0].fixed:'right',
            align: 'center',
            width: btns[0].width ? btns[0].width : 50,
            render: (item) => {
              // 传递当前行的数据
              return <MoreBtn rowItem={item} />;
            },
          },
        ] :
        [...tcolumns];
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.cont}>
        {/* <ConfigProvider renderEmpty={CustomizeRenderEmpty}> */}
        <ConfigProvider
          renderEmpty={() => {
            return isSearch ? (
              <CustomizeRenderEmpty setIsSearch={this.setIsSearch} />
            ) : (
              <NodataRenderEmpty />
            );
          }}
        >
          {tableToolNode ? (
            tableToolNode
          ) : (
            <TableTool
              batchOperationConfig={batchOperationConfig}
              tableToolObj={tableToolObj}
              roleName={roleName}
              listSizes={listSizes}
              listSizeChange={this.listSizeChange.bind(this)}
              isDisabledApplyBtn={isDisabledApplyBtn}
              selectedRowKeys={selectedRowKeys}
              btnsRulesObj={btnsRulesObj}
              setIsDisabledApplyBtn={this.setIsDisabledApplyBtn}
              onTableSelectChangeByTableTool={this.onTableSelectChangeByTableTool}
              selectedRows={this.state.selectedRows}
              setIsSearch={this.setIsSearch}
            />
          )}
          <Table
            onChange={(pagination, filters, sorter)=>{
              if (tableSortConfig&&typeof(tableSortConfig.onSorterChange)==='function') {
                tableSortConfig.onSorterChange(sorter);
              }
            }}
            roleName={roleName}
            size="small"
            loading={tableLoad}
            className={styles.contTable}
            columns={columns}
            rowKey={rowKey}
            expandable={expandable && expandable}
            dataSource={this.loadDataSource(data)}
            rowSelection={
              typeof rowSelectionConfig !== 'undefined' ? rowSelectionConfig : rowSelection
            }
            pagination={this.props.paginationProps ? this.state.paginationProps : false}
            scroll={
              scroll ?
                scroll :
                {
                  x:
                      !scrollConfigObj || scrollConfigObj.isHorizontalScroll ?
                        scrollConfigObj && scrollConfigObj.horizontalScrollWidth ?
                          scrollConfigObj.horizontalScrollWidth :
                          1500 :
                        true,
                  y: tableHight,
                }
            }
          />
          {selectedRowKeys.length > 0 && this.props.paginationProps && (
            <div className={styles.table_select_total} style={{top: `${tableHight + 273}px`}}>
              {selectedRowKeys.length} Selected
            </div>
          )}
        </ConfigProvider>
      </div>
    );
  }
}

BookTable.propTypes = {
  tcolumns: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  btns: PropTypes.array,
  btnsRulesObj: PropTypes.object,
  listSizes: PropTypes.array, // list size seting
  roleName: PropTypes.string,
  tableToolObj: PropTypes.object,
  batchOperationConfig: PropTypes.array,
  paginationProps: PropTypes.object,
  scrollConfigObj: PropTypes.object,
  tableToolNode: PropTypes.node,
  expandable: PropTypes.object,
  scroll: PropTypes.object,
  rowSelectionConfig: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onLoadBefore: PropTypes.func,
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  tableSortConfig: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};
BookTable.defaultProps = {
  rowKey: 'key',
};
export default BookTable;
