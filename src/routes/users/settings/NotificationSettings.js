import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import setTitle from '../../../environments/document';
import { settingActions } from '../../../actions';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import renderLoader from '../../../components/interactive/Loader';
import paths from '../../../constants/path.constants';

import '../../../css/profile.css';

const availableSettings = ['web', 'email'];

const getTitleDesc = (s) => {
    let title, description;
    let options = availableSettings;
    switch (s) {
        case 'commentSettings':
            title = 'Comments';
            description = 'A new comment on your blogs';
            break;
        case 'reactSettings':
            title = 'Reactions';
            description = 'A new reaction on your blogs';
            break;
        case 'groupSettings':
            title = 'Groups';
            description = 'When you have been added to a new group';
            break;
        case 'blogSettings':
            title = 'Blogs';
            description = 'Updates about new blogs of users you subscribed to';
            break;
        case 'customSettings':
            title = 'Custom';
            description = 'Updates or announcements from the site';
            break;
        default:
            title = '';
            description = '';
            options = [];
            break;
    }
    return { title, description, options };
}

class NotificationSettings extends React.Component {
    state = { init: false };

    static getDerivedStateFromProps(props, state) {
        const { settings } = props;
        if (!state.init && settings && !settings.loading && Object.keys(settings).length > 0) {
            for (let s in settings) {
                if (!s.includes('Settings')) continue;
                for (let i = 0; i < availableSettings.length; ++i) {
                    const st = availableSettings[i];
                    const name = s + '_' + st;
                    const check = settings[s].includes(st);
                    state[name] = check;
                }
            }
            state.init = true;
        }
        return state;
    }

    componentDidMount() {
        setTitle('Notification Settings');
        this.fetchSettings();
        this.setState({ init: false });
    }

    fetchSettings = () => {
        const { dispatch } = this.props;

        dispatch(settingActions.getSettings());
    }

    onSave = () => {
        const saveObj = {};
        for (let s in this.state) {
            for (let i = 0; i < availableSettings.length; ++i) {
                const st = availableSettings[i];
                const name = '_' + st;
                if (s.includes(name)) {
                    const o = s.substring(0, s.length - name.length);
                    if (!saveObj[o]) saveObj[o] = [];
                    if (this.state[s]) saveObj[o].push(st);
                }
            }
        }
        const { dispatch } = this.props;

        dispatch(settingActions.updateSettings(saveObj));
    }

    onCheckboxChange = (e) => {
        const check = e.target.name;
        const checked = e.target.checked;
        this.setState({ [check]: checked });
    }

    buildRow = (key, title, description, options) => {
        const titleStyle = { fontWeight: 'bold' };
        const descStyle = { color: 'gray' };
        const list = [];
        for (let i = 0; i < availableSettings.length; ++i) {
            const s = availableSettings[i];
            if (!options.includes(s)) {
                list.push(<td key={key + s}></td>);
                continue;
            }
            const name = key + '_' + s;
            const checked = this.state[name];
            const checkbox = (
                <div className="ui toggle checkbox">
                    <input type="checkbox" name={name} checked={checked} onChange={this.onCheckboxChange} />
                    <label></label>
                </div>
            );
            list.push(<td key={key + name}>{checkbox}</td>);
        }
        return (
            <tr key={key}>
                <td><span style={titleStyle}>{title}</span><br /><span style={descStyle}>{description}</span></td>
                {list}
            </tr>
        );
    }

    buildTableBody = () => {
        const { settings } = this.props;

        const list = [];
        for (let s in settings) {
            const { title, description, options } = getTitleDesc(s);
            list.push(this.buildRow(s, title, description, options));
        }
        return list;
    }

    buildSettingsTable = () => {
        const body = this.buildTableBody();

        return (
            <table className="ui single line table">
                <thead>
                    <tr>
                        <th>Blogger Updates</th>
                        <th><i className="bell icon" /><span>WEB</span></th>
                        <th><i className="envelope icon" /><span>EMAIL</span></th>
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
                <tfoot className="full-width">
                    <tr>
                        <th colSpan="3">
                            <div className="ui small blue button" onClick={this.onSave}>
                                Save
                            </div>
                            <Link className="ui small button" to={paths.PROFILE}>
                                Cancel
                            </Link>
                        </th>
                    </tr>
                </tfoot>
            </table>
        );
    }

    render() {
        const { info, settings } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!settings || settings.loading) return renderLoader();

        const settingsTable = this.buildSettingsTable(settings);

        return (
            <div>
                <div className="ui center aligned header">
                    <h1>Notification Settings:</h1>
                </div>
                {settingsTable}
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, settings } = state;
    return { info: user, settings };
}

const connected = connect(mapStateToProps)(NotificationSettings);
export { connected as NotificationSettings };
