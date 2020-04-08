import React from 'react';

class Privacy extends React.Component {
    render() {
        return (
            <div className="ui container" style={{ marginTop: '4em', marginBottom: '4em' }}>
                <h1 className="ui center aligned header">
                    Privacy
                </h1>
                <div className="ui segment">
                    <p>We value your privacy, so we don't share your info with 3rd parties or use it in anyway it may harm you.</p>
                    <p>All of your sensitive information is saved in our database encrypted.</p>
                    <p>You can create private blogs to keep it with friends only.</p>
                    <p></p>
                    <p>You're providing some information in registration in order to perform some tasks like creating blogs and groups.</p>
                    <p>To identify some users in the website, we are asking to provide users to fill their first name, last name and email.</p>
                    <p>Please be sure we won't ask for any additional information, so in case someone contacts you from our name, please report it.</p>
                </div>
            </div>
        );
    }
}

export { Privacy };
