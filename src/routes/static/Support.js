import React from 'react';

class Support extends React.Component {
    render() {
        const email = <a href="mailto:fgmmaker@gmail.com">fgmmaker@gmail.com</a>;
        return (
            <div className="ui container" style={{ marginTop: '4em', marginBottom: '4em' }}>
                <h1 className="ui center aligned header">
                    Support
                </h1>
                <div className="ui segment">
                    <p>Please read the following before writing us.</p>
                    <p>English is the only available language for Blogger; we are unable to answer inquiries in any other languages. We apologize for the inconvenience.</p>
                    <div className="ui divider"></div>
                    <h4>Bug Reports & Technical Errors</h4>
                    <p>To report bugs, please send an email to {email}. Before creating a new topic,
                    please read the Support Board Rules thread for more information on how to report problems.
                        This includes, for example:</p>
                    <ul>
                        <li>Blog/Group List problems</li>
                        <li>Display problems</li>
                        <li>HTML 500/400/XXX errors</li>
                    </ul>
                    <div className="ui divider"></div>
                    <h4>Other Inquiries</h4>
                    <p>We would love hear from you.</p>
                    <p>Contact at {email}.</p>
                </div>
            </div>
        );
    }
}

export { Support };
