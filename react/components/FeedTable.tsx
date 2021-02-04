/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Table,
  IconCopy,
  IconDownload,
  ButtonWithIcon,
  Tooltip,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'

import { Service } from '../typings/custom.d'

interface FeedTableProps {
  feeds: Service[]
  handleDelete: (filename: string) => void
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>
}

interface FeedTableState {
  tableLength: number
  currentPage: number
  slicedData: Service[]
  currentItemFrom: number
  currentItemTo: number
}

const renderDownload = (cell: any) => {
  const copy = <IconCopy />
  const down = <IconDownload />

  return (
    <div className="flex w-100 justify-between">
      <Tooltip
        label="Link copied"
        duration={100}
        timmingFn="ease-in-out"
        trigger="click"
      >
        <span>
          <CopyToClipboard text={cell.cellData}>
            <ButtonWithIcon size="small" icon={copy}></ButtonWithIcon>
          </CopyToClipboard>
        </span>
      </Tooltip>
      <Tooltip label="Download file">
        <span>
          <ButtonWithIcon
            size="small"
            icon={down}
            href={cell.cellData}
          ></ButtonWithIcon>
        </span>
      </Tooltip>
    </div>
  )
}

const renderID = (cell: any) => {
  const copy = <IconCopy />

  return (
    <div className="flex w-100 justify-between">
      <Tooltip
        label="Copy ID"
        duration={100}
        timmingFn="ease-in-out"
        trigger="click"
      >
        <span>
          <CopyToClipboard text={cell.cellData}>
            <ButtonWithIcon size="small" icon={copy}></ButtonWithIcon>
          </CopyToClipboard>
        </span>
      </Tooltip>
    </div>
  )
}

const INITIAL_LENGTH = 10

const FeedTable = ({
  feeds,
  handleDelete,
  setModalOpen,
  setShowToast,
}: FeedTableProps) => {
  const jsonschema = {
    properties: {
      id: {
        title: 'ID',
        cellRenderer: renderID,
        width: 50,
      },
      filename: {
        title: 'Filename',
        width: 270,
      },
      feedType: {
        title: 'Service Name',
      },
      date: {
        title: 'Updated at',
        width: 150,
        cellRenderer: ({ cellData }) => {
          if (cellData === 'pending') {
            return <span>{cellData}</span>
          }

          const lastIndex = cellData?.lastIndexOf(':')
          const date = cellData.substring(0, lastIndex)

          return <span>{date}</span>
        },
      },
      collectionId: {
        title: 'Collection',
        width: 100,
      },
      size: {
        title: 'Size',
        width: 70,
      },
      download: {
        title: 'Download Link',
        cellRenderer: renderDownload,
        width: 100,
      },
    },
  }

  const [state, setState] = useState<FeedTableState>({
    tableLength: INITIAL_LENGTH,
    currentPage: 1,
    slicedData: [],
    currentItemFrom: 1,
    currentItemTo: INITIAL_LENGTH,
  })

  useEffect(() => {
    setState({
      ...state,
      slicedData: feeds.slice(0, state.tableLength),
    })
  }, [feeds])

  const callSync = async () => {
    setShowToast(true)
    await axios.post('/_v/feed/startJob')
  }

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: Service[]
  ) => {
    setState({
      ...state,
      currentPage,
      currentItemFrom,
      currentItemTo,
      slicedData,
    })
  }

  const handleNextClick = () => {
    const newPage = state.currentPage + 1
    const itemFrom = state.currentItemTo + 1
    const itemTo = state.tableLength * newPage
    const data = feeds.slice(itemFrom - 1, itemTo)

    goToPage(newPage, itemFrom, itemTo, data)
  }

  const handlePrevClick = () => {
    if (state.currentPage === 0) return
    const newPage = state.currentPage - 1
    const itemFrom = state.currentItemFrom - state.tableLength
    const itemTo = state.currentItemFrom - 1
    const data = feeds.slice(itemFrom - 1, itemTo)

    goToPage(newPage, itemFrom, itemTo, data)
  }

  const handleRowsChange = (_e: any, value: number) => {
    const currentItemTo = 1 * value
    const slicedData = feeds.slice(
      state.currentItemFrom,
      currentItemTo
    ) as Service[]

    setState({
      ...state,
      tableLength: 1 * value,
      currentItemTo,
      slicedData,
    })
  }

  return (
    <Table
      fullWidth
      schema={jsonschema}
      items={state.slicedData}
      toolbar={{
        extraActions: {
          label: 'More options',
          actions: [
            {
              label: 'Sync',
              handleCallback: () => callSync(),
            },
          ],
        },
        newLine: {
          label: 'New',
          handleCallback: () => {
            setModalOpen(true)
          },
        },
      }}
      lineActions={[
        {
          label: () => 'Delete',
          isDangerous: true,
          onClick: (row: any) => handleDelete(row.rowData),
        },
      ]}
      emptyStateLabel={
        <FormattedMessage id="export-feeds-io.emptyStateLabel" />
      }
      pagination={{
        onNextClick: handleNextClick,
        onPrevClick: handlePrevClick,
        currentItemFrom: state.currentItemFrom,
        currentItemTo: state.currentItemTo,
        onRowsChange: handleRowsChange,
        textShowRows: <FormattedMessage id="export-feeds-io.showRows" />,
        textOf: <FormattedMessage id="export-feeds-io.of" />,
        totalItems: feeds.length,
        rowsOptions: [10, 15, 25],
      }}
    />
  )
}

export default FeedTable
