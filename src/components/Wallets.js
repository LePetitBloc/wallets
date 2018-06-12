import React from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import './Wallets.css';
import './WebsiteLink';
import WebsiteLink from './WebsiteLink';
import DockerHubLink from './DockerHubLink';
import GithubIcon from './Icons/Github';
import { string as compareString, number as compareNumber } from '../utils/sorts';

const NUMBER_COLUMNS = ['mainnetPort', 'mainRpcPort', 'testnetPort', 'testnetRpcPort', 'requiredTokens'];

const rowDataGetter = _ref => _ref.rowData;

const headerTitleRenderer = title => _ref => {
  const { dataKey, label, sortBy, sortDirection } = _ref;
  const showSortIndicator = sortBy === dataKey;
  const children = [
    React.createElement(
      'a',
      {
        className: 'ReactVirtualized__Table__headerTruncatedText',
        key: 'label',
        title,
      },
      label
    ),
  ];

  if (showSortIndicator) {
    children.push(
      React.createElement(SortIndicator, {
        key: 'SortIndicator',
        sortDirection,
      })
    );
  }

  return children;
};

export default class Wallets extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const sortBy = 'name';
    const sortDirection = SortDirection.DESC;
    const sortedList = this._sortList({ sortBy, sortDirection });

    this.state = {
      headerHeight: 40,
      rowHeight: 40,
      rowCount: this.props.list.length,
      sortBy,
      sortDirection,
      sortedList,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const { headerHeight, rowHeight, rowCount, sortBy, sortDirection, sortedList } = this.state;

    const rowGetter = ({ index }) => this._getDatum(sortedList, index);

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            ref="Table"
            headerClassName={'headerColumn'}
            headerHeight={headerHeight}
            width={width}
            height={height}
            noRowsRenderer={this._noRowsRenderer}
            rowClassName={this._rowClassName}
            rowHeight={rowHeight}
            rowGetter={rowGetter}
            rowCount={rowCount}
            sort={this._sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
          >
            <Column
              label="Name"
              dataKey="name"
              width={100}
              cellDataGetter={rowDataGetter}
              cellRenderer={({ rowData }) => (rowData.website ? <WebsiteLink {...rowData} /> : rowData.name)}
            />
            <Column headerRenderer={headerTitleRenderer('Ticker')} label="$" dataKey="symbol" width={50} />
            <Column label="Parent" dataKey="parent" width={100} />
            <Column
              aria-label="Github repository"
              dataKey="walletSrc"
              disableSort
              width={35}
              cellRenderer={({ cellData }) => (
                <a href={cellData} target="_blank" rel="noreferrer noopener" title={cellData}>
                  <GithubIcon />
                </a>
              )}
            />
            <Column label="Binaries" dataKey="baseBinary" width={100} cellRenderer={({ cellData }) => `${cellData}*`} />
            {width > 800 && (
              <Column
                headerRenderer={headerTitleRenderer('Default configuration file')}
                label={<i className="material-icons">settings</i>}
                aria-label="Default configuration file"
                disableSort
                dataKey="config"
                width={280}
                headerStyle={{ textAlign: 'center' }}
              />
            )}
            <Column label="Port" dataKey="mainnetPort" width={65} className="number" headerClassName="number" />
            <Column label="RPC Port" dataKey="mainRpcPort" width={95} className="number" headerClassName="number" />
            <Column
              headerRenderer={headerTitleRenderer('Required number of tokens for a masternode')}
              label="Required"
              dataKey="requiredTokens"
              width={95}
              className="number"
              headerClassName="number"
            />
            {width > 800 && (
              <Column
                headerRenderer={headerTitleRenderer('Berkeley DB Version')}
                label="BDB"
                dataKey="bdbVersion"
                width={90}
                headerStyle={{ textAlign: 'center' }}
                style={{ textAlign: 'center' }}
              />
            )}
            <Column
              label="Docker"
              width={200}
              headerStyle={{ textAlign: 'center' }}
              style={{ textAlign: 'center' }}
              cellDataGetter={rowDataGetter}
              cellRenderer={({ rowData }) =>
                rowData.images.length > 0 ? (
                  <DockerHubLink image={rowData.images[0]} />
                ) : (
                  <DockerHubLink image={`lepetitbloc/${rowData.baseBinary.toLowerCase()}d`} />
                )
              }
            />
          </Table>
        )}
      </AutoSizer>
    );
  }

  _getDatum(list, index) {
    return list[index % list.length];
  }

  _getRowHeight({ index }) {
    return this._getDatum(this.props.list, index).length;
  }

  _headerRenderer({ dataKey, sortBy, sortDirection }) {
    return (
      <div>
        Full Name
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _isSortEnabled() {
    const { rowCount } = this.state;

    return rowCount <= this.props.list.length;
  }

  _noRowsRenderer() {
    return <div className="noRows">No rows</div>;
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({ rowCount });
  }

  _onScrollToRowChange(event) {
    const { rowCount } = this.state;
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10));

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({ scrollToIndex });
  }

  _rowClassName({ index }) {
    if (index < 0) {
      return 'headerRow';
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow';
    }
  }

  _sort({ sortBy, sortDirection }) {
    const sortedList = this._sortList({ sortBy, sortDirection });

    this.setState({ sortBy, sortDirection, sortedList });
  }

  _sortList({ sortBy, sortDirection }) {
    const compareFunction = NUMBER_COLUMNS.indexOf(sortBy) !== -1 ? compareNumber : compareString;
    const compareSortByFunction = (a, b) => compareFunction(b[sortBy], a[sortBy]);

    if (sortDirection === SortDirection.DESC) {
      return this.props.list.sort(compareSortByFunction).reverse();
    }

    return this.props.list.sort(compareSortByFunction);
  }
}
