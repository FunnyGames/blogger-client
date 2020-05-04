import React, { Component } from 'react';

class Dropdown extends Component {
    state = {
        showMenu: false,
    };

    showMenu = (event) => {
        event.preventDefault();
        const { onMenuOpen } = this.props;
        const wasOpen = this.state.showMenu;

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
            if (onMenuOpen && !wasOpen) {
                onMenuOpen();
            }
        });
    }

    isAllowToClose = (event) => {
        const attributes = event.target.attributes;
        if (attributes) {
            const length = event.target.attributes.length;
            for (let i = 0; i < length; ++i) {
                const a = attributes[i];
                if (a.nodeName === 'allowclose')
                    return true;
            }
        }

        return false;
    }

    closeMenu = (event) => {
        if (!this.dropdownMenu) return;
        if (this.isAllowToClose(event) || !this.dropdownMenu.contains(event.target)) {
            this.setState({ showMenu: false }, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        }
    }

    render() {
        const { button, content, contentClassName } = this.props;
        return (
            <div>
                <div onClick={this.showMenu}>
                    {button}
                    {
                        this.state.showMenu
                            ? (
                                <div className={contentClassName}
                                    ref={(element) => {
                                        this.dropdownMenu = element;
                                    }}
                                >
                                    {content}
                                </div>
                            )
                            : null
                    }
                </div>
            </div>
        );
    }
}

export default Dropdown;