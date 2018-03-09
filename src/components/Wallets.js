import React from 'react'
import {
  AutoSizer,
  Column,
  Table,
  SortDirection,
  SortIndicator,
} from 'react-virtualized'
import 'react-virtualized/styles.css' // only needs to be imported once
import './Wallets.css'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

export default class Wallets extends React.PureComponent {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  constructor(props) {
    super(props)

    const sortBy = 'name'
    const sortDirection = SortDirection.ASC
    const sortedList = this._sortList({ sortBy, sortDirection })

    this.state = {
      headerHeight: 40,
      rowHeight: 40,
      rowCount: this.props.list.size,
      sortBy,
      sortDirection,
      sortedList,
    }

    this._getRowHeight = this._getRowHeight.bind(this)
    this._headerRenderer = this._headerRenderer.bind(this)
    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowCountChange = this._onRowCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowClassName = this._rowClassName.bind(this)
    this._sort = this._sort.bind(this)
  }

  render() {
    const {
      headerHeight,
      rowHeight,
      rowCount,
      sortBy,
      sortDirection,
      sortedList,
    } = this.state

    const rowGetter = ({ index }) => this._getDatum(sortedList, index)

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
            <Column label="Name" dataKey="name" width={100} />
            <Column label="$" dataKey="symbol" width={50} />
            <Column label="Parent" dataKey="parent" width={100} />
            <Column
              label="src"
              dataKey="walletSrc"
              width={35}
              cellRenderer={({ cellData }) => (
                <a href={cellData} target="_blank" title={cellData}>
                  <i className="material-icons">link</i>
                </a>
              )}
            />
            <Column
              label="Binaries"
              dataKey="baseBinary"
              width={100}
              cellRenderer={({ cellData }) => `${cellData}*`}
            />
            {width > 800 && (
              <Column
                label={<i className="material-icons">settings</i>}
                aria-label="configuration file"
                disableSort
                dataKey="config"
                width={280}
                headerStyle={{ textAlign: 'center' }}
              />
            )}
            <Column
              label="Port"
              dataKey="mainnetPort"
              width={65}
              className="number"
              headerClassName="number"
            />
            <Column
              label="RPC Port"
              dataKey="mainRpcPort"
              width={95}
              className="number"
              headerClassName="number"
            />
            <Column
              label="Required"
              dataKey="requiredTokens"
              width={95}
              className="number"
              headerClassName="number"
            />
            {width > 800 && (
              <Column
                label="BDB"
                dataKey="bdbVersion"
                width={90}
                headerStyle={{ textAlign: 'center' }}
                style={{ textAlign: 'center' }}
              />
            )}
            <Column
                label="Docker"
                dataKey="images"
                width={200}
                headerStyle={{ textAlign: 'center' }}
                style={{ textAlign: 'center' }}
                cellRenderer={({ cellData }) => (
                    cellData.size > 0 &&
                      <a href={`https://hub.docker.com/r/${cellData.get(0)}/`} target="_blank" title={cellData.get(0)}>
                          {cellData.get(0)}
                      </a>
                )}
            />
          </Table>
        )}
      </AutoSizer>
    )
  }

  _getDatum(list, index) {
    return list.get(index % list.size)
  }

  _getRowHeight({ index }) {
    const { list } = this.props

    return this._getDatum(this.props.list, index).size
  }

  _headerRenderer({ dataKey, sortBy, sortDirection }) {
    return (
      <div>
        Full Name
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    )
  }

  _isSortEnabled() {
    const { rowCount } = this.state

    return rowCount <= this.props.list.size
  }

  _noRowsRenderer() {
    return <div className="noRows">No rows</div>
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToRowChange(event) {
    const { rowCount } = this.state
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  _rowClassName({ index }) {
    if (index < 0) {
      return 'headerRow'
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow'
    }
  }

  _sort({ sortBy, sortDirection }) {
    const sortedList = this._sortList({ sortBy, sortDirection })

    this.setState({ sortBy, sortDirection, sortedList })
  }

  _sortList({ sortBy, sortDirection }) {
    return this.props.list
      .sort(item => item[sortBy])
      .update(
        list => (sortDirection === SortDirection.DESC ? list.reverse() : list)
      )
  }
}
