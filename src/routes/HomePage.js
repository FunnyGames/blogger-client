import React from 'react';
import { connect } from 'react-redux';
import { BlogsList } from './blogs/BlogsList';
import setTitle from '../environments/document';
import * as utils from '../helpers/utils';

const RECENT = 'recent';
const SUBS = 'subs';
const FRIENDS = 'friends';

class HomePage extends React.Component {
    state = {
        activeList: RECENT
    };

    componentDidMount() {
        setTitle("Homepage");
    }

    changeMenu = (type) => {
        this.setState({ activeList: type });
    }

    buildMenuItem = (text, type) => {
        const { activeList } = this.state;
        const cls = activeList === type ? 'item active' : 'item';
        return (<div class={cls} style={{ cursor: 'pointer' }} onClick={() => this.changeMenu(type)}>{text}</div>);
    }

    buildMenuList = () => {
        const list = [];
        list.push(this.buildMenuItem('Recent Blogs', RECENT));
        list.push(this.buildMenuItem('Subscriptions', SUBS));
        list.push(this.buildMenuItem('Friends', FRIENDS));
        return list;
    }

    render() {
        const { activeList } = this.state;
        const menuList = this.buildMenuList();
        const isLoggedIn = utils.getUserId();
        const currentTab = isLoggedIn ? activeList : RECENT;
        return (
            <div className="ui container">
                {isLoggedIn && <div class="ui three item menu" style={{ marginTop: '2em' }}>
                    {menuList}
                </div>
                }
                <BlogsList currentTab={currentTab} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const connected = connect(mapStateToProps)(HomePage);
export { connected as HomePage };
