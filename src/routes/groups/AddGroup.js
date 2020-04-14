import React from 'react';
import { connect } from 'react-redux';
import { groupActions } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import history from '../../helpers/history';
import Group from '../../forms/groups/GroupForm';

class AddGroup extends React.Component {
    componentDidMount() {
        setTitle("Add new group");
    }

    handleCancel = (e) => {
        e.preventDefault();
        history.push(paths.GROUPS);
    }

    onSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get values from form
        let { name, description, members } = values;

        // Try to update
        if (name && description) {
            if (members) {
                members = members.map(m => m.value);
            }
            let data = {
                name: name.trim(),
                description: description.trim(),
                members
            }
            dispatch(groupActions.createGroup(data));
        }
    }

    render() {
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Add Group:</h1>
                    </div>
                </div>
                <div className="ui container">
                    <Group onSubmit={this.onSubmit} onCancel={this.handleCancel} />
                </div>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

const connected = connect(mapStateToProps)(AddGroup);
export { connected as AddGroup };