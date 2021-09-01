import React, {Component} from 'react';
import styles from './TableTool.less';
import {Row, Col, Space, Select, Button, Tooltip, Divider, Drawer, Input, Badge} from 'antd';
import {SearchOutlined, SettingOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import ListFilterIcon from '../../assets/icons/ListFilterIcon/ListFilterIcon';
import ButtonForPopover from '../ButtonForPopover';
import ListShowSizeSelect from '@/components/ListShowSizeSelect/ListShowSizeSelect';
import ListFilter from './ListFilter';
import PropTypes from 'prop-types';
import {IconExpandIcon} from '@/resourceUtils/tssCustomIcon';
const {Option} = Select;

/**
 *
 *
 * @class TableTool
 * @extends {Component}
 */
class TableTool extends Component {
  /**
   * Creates an instance of TableTool.
   * @param {*} props
   * @memberof TableTool
   */
  constructor(props) {
    super(props);
    this.state = {
      showSetingTooltipVisible: false, // showSeting Tooltip open and close
      filterTooltipVisible: false, // filter Tooltip open and close
      drawerShow: false,
      selectAction: this.props.batchOperationConfig && this.props.batchOperationConfig[0].value,
      searchSelectAction:
        this.props.tableToolObj &&
        this.props.tableToolObj.searchSelectConfig &&
        this.props.tableToolObj.searchSelectConfig[0].value,
    };

    // set Filter Tooltip show and hide
    this.setFilterTooltipVisible = (onTurn) => {
      this.setState({filterTooltipVisible: onTurn});
    };

    // set Show Seting show and hide
    this.setShowSetingTooltipVisible = (onTurn) => {
      this.setState({showSetingTooltipVisible: onTurn});
    };

    // show DrawerSerch
    this.showDrawer = () => {
      this.setState({
        drawerShow: true,
      });
    };

    // show DrawerSerch
    this.closeDrawer = () => {
      this.setState({
        drawerShow: false,
      });
    };

    // then select change selectAction
    this.onChangeOfSelect = (value) => {
      this.setState({selectAction: value});
      const {btnsRulesObj, setIsDisabledApplyBtn, onTableSelectChangeByTableTool} = props;
      onTableSelectChangeByTableTool(value);
      if (btnsRulesObj && typeof btnsRulesObj.batchOperationRules === 'function') {
        setIsDisabledApplyBtn(btnsRulesObj.batchOperationRules, value);
      }
    };

    // 搜索框的select 变动时
    this.onChangeOfSearchSelect = (val) => {
      this.setState({searchSelectAction: val});
    };
  }
  /**
   *
   *
   * @return {*} dom
   * @memberof TableTool
   */
  render() {
    const searchRef = React.createRef();
    const {
      listSizes,
      listSizeChange,
      batchOperationConfig,
      isDisabledApplyBtn,
      tableToolObj,
      btnsRulesObj,
      selectedRows,
      setIsSearch,
    } = this.props;
    const {selectAction, searchSelectAction, filterTooltipVisible, showSetingTooltipVisible} =
      this.state;
    return (
      <div className={styles.tableTool}>
        <Row>
          <Col span={24}>
            <Row gutter={30} className={styles.tableToolRow}>
              <Col span={10}>
                {tableToolObj && tableToolObj.batchOperationNode ? (
                  tableToolObj.batchOperationNode
                ) : (
                  <Space size="middle">
                    <Select
                      suffixIcon={<IconExpandIcon />}
                      placeholder="Bulk Action"
                      className={styles.tableToolSelect}
                      dropdownMatchSelectWidth={
                        tableToolObj.selectOpWidth ? tableToolObj.selectOpWidth : 160
                      }
                      onChange={this.onChangeOfSelect}
                    >
                      {batchOperationConfig.map((item, idx) => {
                        return (
                          <Option key={idx} value={item.value}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <Button
                      disabled={isDisabledApplyBtn}
                      onClick={() => {
                        tableToolObj.btnsEveny.batchApply(selectAction, selectedRows);
                      }}
                      type="primary"
                    >
                      Apply
                    </Button>
                  </Space>
                )}
              </Col>
              <Col span={14} className={styles.colAginRight}>
                {
                  btnsRulesObj &&
                  btnsRulesObj.tableToolBtnsRules &&
                  btnsRulesObj.tableToolBtnsRules.isNotSearch?<></>:
                  <Tooltip title="search">
                    <Button
                      className={styles.tableToolNotBorCircleBtn}
                      shape="circle"
                      size="large"
                      onClick={this.showDrawer}
                      icon={<SearchOutlined />}
                    />
                  </Tooltip>
                }

                {btnsRulesObj &&
                  btnsRulesObj.tableToolBtnsRules &&
                  (btnsRulesObj.tableToolBtnsRules.isFilter ||
                    btnsRulesObj.tableToolBtnsRules.isShowSeting) && (
                  <Divider type="vertical" className={styles.tableToolDivider} />
                )}
                <Space size="middle">
                  {btnsRulesObj &&
                    btnsRulesObj.tableToolBtnsRules &&
                    btnsRulesObj.tableToolBtnsRules.isFilter && (
                    <Tooltip title="filter">
                      <ButtonForPopover
                        visible={filterTooltipVisible}
                        width={
                            tableToolObj &&
                            tableToolObj.ListFilterContNode &&
                            tableToolObj.ListFilterContNode.width ?
                              tableToolObj.ListFilterContNode.width :
                              275
                        }
                        placement="leftBottom"
                        content={
                            tableToolObj &&
                            tableToolObj.ListFilterContNode &&
                            tableToolObj.ListFilterContNode.node ? (
                              tableToolObj.ListFilterContNode.node
                            ) : (
                              <ListFilter
                                setFilterTooltipVisible={this.setFilterTooltipVisible}
                                title={
                                  tableToolObj &&
                                  tableToolObj.ListFilterContNode &&
                                  tableToolObj.ListFilterContNode.title ?
                                    tableToolObj.ListFilterContNode.title :
                                    'Filter Customers'
                                }
                                PopoverVisible={this.PopoverVisible}
                                PopoerHide={this.PopoerHide}
                                propsAllSelectOfOptionConfig={
                                  tableToolObj &&
                                  tableToolObj.ListFilterContNode &&
                                  tableToolObj.ListFilterContNode.propsAllSelectOfOptionConfig ?
                                    tableToolObj.ListFilterContNode.propsAllSelectOfOptionConfig :
                                    null
                                }
                                onSubmitSuccess={
                                  tableToolObj &&
                                  tableToolObj.ListFilterContNode &&
                                  tableToolObj.ListFilterContNode.onSubmitSuccess ?
                                    tableToolObj.ListFilterContNode.onSubmitSuccess :
                                    null
                                }
                              />
                            )
                        }
                        trigger="click"
                      >
                        <Badge dot offset={[-10, 10]} className={styles.badge_doc}>
                          <Button
                            onClick={() => {
                              this.setFilterTooltipVisible(!filterTooltipVisible);
                            }}
                            className={styles.tableToolNotBorCircleBtn}
                            shape="circle"
                            size="large"
                            icon={<ListFilterIcon />}
                          />
                        </Badge>
                      </ButtonForPopover>
                    </Tooltip>
                  )}
                  {btnsRulesObj &&
                    btnsRulesObj.tableToolBtnsRules &&
                    btnsRulesObj.tableToolBtnsRules.isShowSeting && (
                    <Tooltip title="ShowSeting">
                      <ButtonForPopover
                        visible={showSetingTooltipVisible}
                        width={110}
                        placement="bottom"
                        trigger="click"
                        content={
                          <ListShowSizeSelect
                            setFilterTooltipVisible={this.setShowSetingTooltipVisible}
                            sizearr={listSizes && listSizes.length > 0 ? listSizes : []}
                            title="Show"
                            listSizeChange={listSizeChange}
                          />
                        }
                      >
                        <Button
                          onClick={() => {
                            this.setShowSetingTooltipVisible(!showSetingTooltipVisible);
                          }}
                          className={styles.tableToolNotBorCircleBtn}
                          shape="circle"
                          size="large"
                          icon={<SettingOutlined />}
                        />
                      </ButtonForPopover>
                    </Tooltip>
                  )}
                </Space>
              </Col>
            </Row>
            <Drawer
              height="40"
              width="100%"
              headerStyle={{display: 'none'}}
              className={this.state.drawerShow ? '${styles.drawershow}' : '${styles.drawerhide}'}
              title=""
              placement="right"
              closable={false}
              onClose={this.closeDrawer}
              visible={this.state.drawerShow}
              getContainer={false}
              style={{position: 'absolute'}}
            >
              <div className={styles.tableToolSerchMode}>
                <Row>
                  <Col span={22}>
                    <Row gutter={16}>
                      <Col xs={2} sm={2} xl={1}>
                        <Tooltip title="back">
                          <Button
                            className={styles.tableToolNotBorCircleBtn}
                            onClick={this.closeDrawer}
                            shape="circle"
                            size="large"
                            icon={<ArrowLeftOutlined />}
                          />
                        </Tooltip>
                      </Col>
                      {tableToolObj.searchSelectConfig &&
                        tableToolObj.searchSelectConfig.length > 0 && (
                        <Col span={4}>
                          <Select
                            suffixIcon={<IconExpandIcon />}
                            defaultValue={searchSelectAction}
                            onChange={this.onChangeOfSearchSelect}
                            className={styles.tableToolSerchSelect}
                          >
                            {tableToolObj.searchSelectConfig.map((item, idx) => {
                              return (
                                <Option key={idx} value={item.value}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Col>
                      )}
                      {tableToolObj.searchSelectConfig &&
                      tableToolObj.searchSelectConfig.length > 0 ? (
                        <Col xs={18} sm={18} xl={19}>
                          <Input
                            ref={searchRef}
                            className={styles.tableToolSerchInput}
                            allowClear={true}
                            placeholder={
                              tableToolObj.searchInputPlaceholder ?
                                tableToolObj.searchInputPlaceholder :
                                'Input your search info'
                            }
                            bordered={false}
                          />
                        </Col>
                      ) : (
                        <Col xs={22} sm={22} xl={19}>
                          <Input
                            ref={searchRef}
                            className={styles.tableToolSerchInput}
                            allowClear={true}
                            placeholder={
                              tableToolObj.searchInputPlaceholder ?
                                tableToolObj.searchInputPlaceholder :
                                'Input your search info'
                            }
                            bordered={false}
                          />
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col span={2} className={styles.colAginRight}>
                    <Tooltip title="search">
                      <Button
                        onClick={() => {
                          setIsSearch(true);
                          tableToolObj.btnsEveny.tableSearch(
                              searchSelectAction,
                              searchRef.current.state.value,
                          );
                        }}
                        className={styles.tableToolNotBorCircleBtn}
                        shape="circle"
                        size="large"
                        icon={<SearchOutlined />}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            </Drawer>
          </Col>
        </Row>
      </div>
    );
  }
}
TableTool.propTypes = {
  listSizes: PropTypes.array, // [10,20,30]size seting
  listSizeChange: PropTypes.func,
  roleName: PropTypes.string,
  isDisabledApplyBtn: PropTypes.bool,
  tableToolObj: PropTypes.object,
  batchOperationConfig: PropTypes.array,
  selectedRowKeys: PropTypes.array,
  btnsRulesObj: PropTypes.object,
  setIsDisabledApplyBtn: PropTypes.func,
  onTableSelectChangeByTableTool: PropTypes.func,
  selectedRows: PropTypes.array,
  setIsSearch: PropTypes.func,
};

export default TableTool;
