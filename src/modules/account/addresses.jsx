/*!
 *我的地址
 */
import $ from 'webpack-zepto';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Page from '../../components/page';
import Bar from '../../components/bar';
import Loader from '../../components/loader';
import Toast from '../../components/toast';
import Env from '../../support/env';
import Filter from '../../support/filter';

export default class Addresses extends Component {

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      title: '我的地址',
      loading: true,
      list: [],
    };
  }

  // 清空组件
  clearWidget = () => {
    this.setState({ widget: null });
  }

  appendList = (list) => {
    this.setState({
      loading: false,
      list: this.state.list.concat(list),
    });
  }

  setDefault = (item, idx) => {
    if (!item.defaultFlag) {
      this.setState({
        widget: <Toast icon="loading" message="请稍后" time={ 10000 } callback={ this.clearWidget } />
      });
      $.post('/account/ajax/default', {
        id: item.id,
      }, (res) => {
        if (res.code === 200) {
          this.state.list.map((item, index) => {
            item.defaultFlag = index === idx ? 1 : 0;
            return item;
          });
          this.setState({
            list: this.state.list,
            widget: <Toast icon="success" message="设置成功" callback={ this.clearWidget } />
          });
        } else {
          this.setState({
            widget: <Toast icon="failure" message="设置失败" callback={ this.clearWidget } />
          });
        }
      });
    }
  }

  renderList() {
    if (!this.state.loading && this.state.list.length === 0) {
      return (
        <div className="feedback">
          <div className="mark">
            <img width="220" height="220" src="//img1.qdingnet.com/b70973ae84276a865ae7ae673ea1e318.png" alt="空白" />
          </div>
          <div className="describe">还没有地址，去添加一个吧！</div>
          <div className="vspace hspace">
            <Link className="button driving" to="/account/address">新增地址</Link>
          </div>
        </div>
      );
    }
    return this.state.list.map((item, idx) => {
      return (
        <div key={ idx} className="list">
          <Link is class="item" ui-mode="15px" to={ `/account/address/${ item.id }` }>
            <i className="icon text-xl text-darkgray">&#xe60d;</i>
            <div className="text">
              <p className="text-justify text-md">
                <span>{ item.name }</span>
                <span className="value text-right">{ item.mobile }</span>
              </p>
              <div className="brief">{ item.addressStr }</div>
            </div>
            <i className="icon">&#xe61a;</i>
          </Link>
          <div className="item">
            <label className="text text-sm text-darkgray">
              <input className="checkbox" type="radio" name="defaultFlag" checked={ item.defaultFlag } onChange={ this.setDefault.bind(this, item, idx) } />设为默认
            </label>
            <div className="extra">
              <div className="button-group">
                <Link className="button default sm" to={ `/account/address/${ item.id }` }><i className="icon">&#xe627;</i>编辑</Link>
                <a className="button default sm"  disabled={ item.defaultFlag }><i className="icon">&#xe629;</i>删除</a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    let wallet = this.state.wallet;
    return (
      <Page className="addresses" title={ this.state.title } widget={ this.state.widget }>
        {/* main */}
        <section className="main has-footer">
          <Loader url="/account/ajax/addresses" callback={ this.appendList } ends={ null }>
            <div className="content" >
              { this.renderList() }
            </div>
          </Loader>
        </section>

        { this.state.list.length > 0 &&
          <Bar component="footer" className="btm-fixed">
            <div className="button-group compact">
              <Link className="button driving square" to='/account/address'>新增地址</Link>
            </div>
          </Bar>
        }
      </Page>
    );
  }
};