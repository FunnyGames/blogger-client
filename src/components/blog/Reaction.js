import React from 'react';
import { connect } from 'react-redux';
import { FacebookSelector } from 'react-reactions';
import ReactTooltip from 'react-tooltip';
import * as utils from '../../helpers/utils';
import BasicModal from '../interactive/BasicModal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import globalConstants from '../../constants/global.constants';
import { reactionActions } from '../../actions';
import paths from '../../constants/path.constants';
import history from '../../helpers/history';
import _ from 'lodash';

import like from '../../images/emojis/like.svg';
import love from '../../images/emojis/love.svg';
import haha from '../../images/emojis/haha.svg';
import wow from '../../images/emojis/wow.svg';
import sad from '../../images/emojis/sad.svg';
import angry from '../../images/emojis/angry.svg';

import '../../css/reaction.css';
import 'react-tabs/style/react-tabs.css';

export const reacts = {
    none: 'none',
    like: 'like',
    love: 'love',
    haha: 'haha',
    wow: 'wow',
    sad: 'sad',
    angry: 'angry'
};

class Reaction extends React.Component {
    state = {
        react: reacts.none,
        currentTab: reacts.none
    };

    openModal = {};

    componentDidMount() {
        const { dispatch, blogId } = this.props;

        dispatch(reactionActions.getReactions(blogId));
    }

    onSelect = (react) => {
        const { dispatch, blogId, reactions } = this.props;

        if (react !== reacts.none) {
            dispatch(reactionActions.createReaction(blogId, { react }));
        } else if (reactions && reactions.myReaction) {
            dispatch(reactionActions.deleteReaction(reactions.myReaction._id));
        }
    }

    cancelReaction = () => {
        if (this.state.react !== reacts.none) {
            this.onSelect(reacts.none);
        } else {
            this.onSelect(reacts.like);
        }
    }

    setReactionImage = (react) => {
        switch (react) {
            case reacts.like: return like;
            case reacts.love: return love;
            case reacts.haha: return haha;
            case reacts.wow: return wow;
            case reacts.sad: return sad;
            case reacts.angry: return angry;
            default: break;
        }
        return '';
    }

    setReactionText = (react) => {
        switch (react) {
            case reacts.like: return 'Like';
            case reacts.love: return 'Love';
            case reacts.haha: return 'Haha';
            case reacts.wow: return 'Wow';
            case reacts.sad: return 'Sad';
            case reacts.angry: return 'Angry';
            default: break;
        }
        return 'Like';
    }

    openLikes = (e) => {
        e.stopPropagation();
        if (this.openModal.func) {
            this.openModal.func();
            this.fetchUsers(true);
        }
    }


    fetchUsers(clear, filter) {
        if (clear) {
            this.props.dispatch(reactionActions.clear());
        }
        // Get dispatch function from props
        const { dispatch, userReactions, blogId } = this.props;

        const limit = globalConstants.REACTION_USER_ROWS_LIMIT;
        let data = {};
        if (userReactions && userReactions.reactions && !clear) {
            data.seenIds = userReactions.reactions.map(c => c.reactionId);
        }
        if (filter) {
            data.filter = filter;
        }
        dispatch(reactionActions.getUsersReactions(blogId, data, limit));
    }

    countReactions = (totals, reactType) => {
        let count = 0;
        if (totals && totals.length > 0) {
            const len = totals.length;
            for (let i = 0; i < len; ++i) {
                count += totals[i].count;
            }
        }
        count += reactType !== reacts.none ? 0 : 0;
        return count;
    }

    buildToolip = (totals, reactType) => {
        let tip = '<div>';
        totals = totals.filter(c => c.count > 0 || (reactType === c.react && c.count === 0));
        if (totals.length > 0) {
            const len = totals.length;
            const half = Math.ceil(len / 2);
            totals = totals.sort((a, b) => {
                if (a.count > b.count) return -1;
                if (a.count < b.count) return 1;
                return 0;
            });
            for (let i = 0; i < len; ++i) {
                const { react, count } = totals[i];
                const liked = reactType === react ? 0 : 0;
                const image = this.setReactionImage(react);
                const format = utils.nFormatter(count + liked);
                tip += `${format} <img src="${image}" width="12px" height="12px" />`;
                if (i === half - 1 && len > 3) tip += '<br />';
                else if (i + 1 !== len) tip += ', ';
            }
        } else {
            tip += 'No likes';
        }
        tip += '</div>';
        return tip;
    }

    getReactOrUndefined = (react) => {
        return react === reacts.none ? undefined : react;
    }

    changeTab = (react) => {
        const fetchReact = this.getReactOrUndefined(react);
        this.setState({ currentTab: react }, () => this.fetchUsers(true, fetchReact));
    }

    buildTabContent = (react) => {
        const { userReactions } = this.props;
        if (!userReactions || !userReactions.reactions || react !== this.state.currentTab) {
            return <TabPanel key={react + "-tab-content"}>
                <div className="ui active inverted dimmer">
                    <div className="ui large text loader">Loading...</div>
                </div>
            </TabPanel>;
        }
        const { reactions, metadata } = userReactions;
        let content = [];
        for (let i = 0; i < reactions.length; ++i) {
            const r = reactions[i];
            const { reactionId, username, userId, react } = r;
            const image = this.setReactionImage(react);
            const userUrl = userId ? utils.convertUrlPath(paths.USER, { id: userId }) : '';
            content.push(
                <div key={reactionId} style={{ cursor: 'pointer' }} className="ui segment" onClick={e => { e.stopPropagation(); history.push(userUrl); }}>
                    <b>{username}</b> <img src={image} width="16px" height="16px" />
                </div>
            );
        }
        if (userReactions.loading) {
            content.push(<div className="ui loading segment">Loading...</div>);
        } else if (metadata && metadata.total) {
            if (metadata.total > globalConstants.REACTION_USER_ROWS_LIMIT) {
                const fetchReact = this.getReactOrUndefined(react);
                const loadMore = (<div key="react-loadMore"><p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.fetchUsers(false, fetchReact)}>Load More...</p></div>);
                content.push(loadMore);
            }
        }
        return <TabPanel key={react + "-tab-content"}>{content}</TabPanel>;
    }

    buildTabList = (totals, reactType) => {
        totals = totals.filter(c => c.count > 0 || (reactType === c.react && c.count === 0));
        const tabsList = [<Tab key="all-tab" onClick={e => this.changeTab(reacts.none)}>All</Tab>];
        const tabsContentList = [this.buildTabContent(reacts.none)];
        const len = totals.length;
        for (let i = 0; i < len; ++i) {
            const { react, count } = totals[i];
            const image = this.setReactionImage(react);
            const liked = reactType === react ? 0 : 0;
            const countReacts = count + liked;
            if (countReacts > 0) {
                const tab = <Tab key={react + "-tab"} onClick={e => this.changeTab(react)}><img src={image} width="16px" height="16px" /><b> {countReacts}</b></Tab>;
                const tabContent = this.buildTabContent(react);
                tabsList.push(tab);
                tabsContentList.push(tabContent);
            }

        }
        return { tabsList, tabsContentList };
    }

    renderLoader() {
        return <div className="ui labeled button" tabIndex="0">
            <div className="ui loading basic button" style={{ minWidth: '60px' }}>...</div>
            <p className="ui basic blue left pointing label">
                <b height="100%">-</b>
            </p>
        </div>
    }

    render() {
        const { react } = this.state;
        const { reaction, reactions, loggedIn } = this.props;
        if (reactions.loading) {
            return this.renderLoader();
        }
        if (reactions.myReaction && !reactions.myReaction.loading) {
            let r = reactions.myReaction.react;
            if (!r) r = reacts.none;
            if (this.state.react !== r) {
                this.setState({ react: r });
            }
        }
        let totals = reactions.reacts;
        if (!totals) totals = [];
        const reactType = reaction || react;
        const image = this.setReactionImage(reactType);
        const text = this.setReactionText(reactType);
        const totalTooptip = this.buildToolip(totals, reactType);
        const numerOfLikes = this.countReactions(totals, reactType);
        const formattedNumberOfLikes = utils.nFormatter(numerOfLikes);

        const likeButtonClass = `ui basic ${image ? 'blue' : ''} button`;
        const { tabsList, tabsContentList } = this.buildTabList(totals, reactType);

        const activeButtons = loggedIn && (!reactions.myReaction || (reactions.myReaction && !reactions.myReaction.loading));
        const cancelButton = activeButtons ? this.cancelReaction : null;
        const openLikesButton = activeButtons ? this.openLikes : null;

        return (
            <div className="ui labeled button" tabIndex="0">
                <div className="ui labeled button" tabIndex="0" onClick={cancelButton}>
                    <div id="like_button" className={likeButtonClass}>
                        {activeButtons &&
                            <div className="reaction_display" onClick={e => e.stopPropagation()}><FacebookSelector onSelect={this.onSelect} /></div>
                        }
                        <img src={image} width="12px" height="12px" alt=""></img> {text}
                    </div>
                    <p className="ui basic blue left pointing label" onClick={openLikesButton}>
                        <b data-tip={totalTooptip} height="100%">{formattedNumberOfLikes}</b>
                    </p>
                    <ReactTooltip effect="solid" html={true} />
                </div>
                <BasicModal openModal={this.openModal}>
                    <p></p>
                    <Tabs style={{ minWidth: '350px' }}>
                        <TabList>
                            {tabsList}
                        </TabList>
                        {tabsContentList}
                    </Tabs>
                </BasicModal>
            </div>
        );
    }
}

function addDefaults(reactions) {
    if (reactions && reactions.reacts) {
        const r = reactions.reacts;
        const len = r.length;
        if (len < 6) {
            const count = 0;
            let obj = _.mapKeys(r, 'react');
            for (let key in reacts) {
                if (key === reacts.none) continue;
                if (!obj[key]) {
                    r.push({ count, react: key });
                }
            }
        }
    }
}

function mapStateToProps(state) {
    const { reactions, userReactions } = state;
    addDefaults(reactions);
    return { reactions, userReactions };
}

const connected = connect(mapStateToProps)(Reaction);
export default connected;