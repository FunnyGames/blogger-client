import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import globalConstants from '../../constants/global.constants';
import renderLoader from './Loader';

import '../../css/table.css';

const { TABLE_MAX_PAGES, TABLE_MAX_ROWS } = globalConstants;

// Component for table
class Table extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    calculateNumberOfPages(totalRows) {
        if (!totalRows) totalRows = 0;
        return Math.ceil(totalRows / TABLE_MAX_ROWS);
    }

    renderPageNumbers(totalRows) {
        let currentPage = this.state.page;
        let onPageChange = this.changePage;
        const pages = this.calculateNumberOfPages(totalRows);

        // Make sure that current page and max pages are limited
        if (!currentPage || currentPage <= 0) currentPage = 1;
        if (currentPage > pages) currentPage = pages;

        // Create an array of columns of pages
        let aPages = [];
        let prevPage = Math.max(1, currentPage - 1);
        let nextPage = Math.min(pages, currentPage + 1);
        aPages.push(<a key="00" className="icon item" onClick={() => onPageChange(prevPage)}>
            <i className="left chevron icon"></i>
        </a>);

        let minPage = 1;
        let maxPage = pages;
        if (pages > TABLE_MAX_PAGES) {
            let half = TABLE_MAX_PAGES / 2;
            minPage = currentPage - half + 1;
            if (minPage <= 1) {
                minPage = 1;
                maxPage = TABLE_MAX_PAGES;
            } else {
                // Add jump to first page
                aPages.push(<a key="0" className="icon item" onClick={() => onPageChange(1)}>...</a>);
                maxPage = currentPage + half - 1;
                if (maxPage > pages) {
                    minPage = currentPage - (maxPage - pages) - half + 1;
                    maxPage = pages;
                }
            }
        }
        let key;

        for (let i = minPage - 1; i < maxPage; ++i) {
            let selected = (currentPage === i + 1 ? "pageselected" : undefined);
            let key = i + 1 + "";
            aPages.push(<a key={key} id={selected} className="item" onClick={() => onPageChange(i + 1)}>{i + 1}</a>);
        }
        // No pages - so make 1 page
        if (maxPage === 0) {
            aPages.push(<a key="no-data-page-1" id="pageselected" className="item">{1}</a>);
        }

        // Add jump to last page
        if (pages > maxPage) {
            aPages.push(<a key="last" className="icon item" onClick={() => onPageChange(pages)}>...</a>);
        }

        key = pages + 1 + "";
        aPages.push(<a key={key} className="icon item" onClick={() => onPageChange(nextPage)}>
            <i className="right chevron icon"></i>
        </a>);
        return aPages;
    }

    changePage = (page) => {
        if (page < 1) return;
        if (page === this.state.page) return;
        const { onPageChange } = this.props;
        onPageChange(page);
        this.setState({ page });
    }

    changeSelection = (selectedOption) => {
        const { onSelectChange } = this.props;
        onSelectChange(selectedOption);
        this.setState({ selectedOption });
    }

    search = _.debounce((name) => {
        this.props.onSearch(name);
    }, 1000);

    updateName = (name) => {
        this.setState({ name });
    }

    render() {
        const { tableRows, totalRows, loading, options, searchPlaceHolder, initialInput } = this.props;
        const { selectedOption } = this.state;
        const searchValue = this.state.name === undefined ? initialInput : this.state.name;
        return (
            <div>
                <div className="">
                    <div className="ui search">
                        <div className="ui icon input">
                            <input
                                key="search"
                                className="prompt"
                                type="text"
                                placeholder={searchPlaceHolder}
                                onChange={
                                    e => {
                                        if (!loading) {
                                            this.search(e.target.value);
                                            this.updateName(e.target.value);
                                        }
                                    }
                                }
                                value={searchValue} />
                            <i className="search icon"></i>
                        </div>
                        {options ?
                            <div className="" style={{ float: 'right', maxWidth: '15em', minWidth: '15em' }}>
                                <Select
                                    placeholder="Sort by"
                                    isDisabled={loading}
                                    value={selectedOption}
                                    onChange={this.changeSelection}
                                    options={options}
                                />
                            </div>
                            : null}
                    </div>
                </div>
                <p></p>
                {loading ? renderLoader() :
                    <div>
                        <table className="ui basic inverted blue table">
                            <tbody>
                                {tableRows}
                            </tbody>
                        </table>
                        <center>
                            <table>
                                <tbody>
                                    <tr>
                                        <th colSpan="5">
                                            <div className="ui center pagination menu">
                                                {this.renderPageNumbers(totalRows)}
                                            </div>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                    </div>
                }
            </div>
        );
    }
}

export default Table;