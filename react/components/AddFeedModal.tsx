import React, { useState } from 'react'
// import { FormattedMessage } from 'react-intl'
import { Modal, Button, Input, Dropdown } from 'vtex.styleguide'

import { ServiceRequest } from '../typings/custom.d'
import { RECCURENCE_UNITS } from '../utils'

const DROPDOWN_OPTS_SERVICE_TYPE = [
  // {
  //   value: 'ProfitShare',
  //   label: 'ProfitShare',
  // },
  // {
  //   value: '2Performant',
  //   label: '2performant',
  // },
  // {
  //   value: 'Retargeting',
  //   label: 'Retargeting',
  // },
  {
    value: 'RevealCustomers',
    label: 'Reveal Customers',
  },
  {
    value: 'RevealCategories',
    label: 'Reveal Categories',
  },
  {
    value: 'RevealProducts',
    label: 'Reveal Products',
  },
  {
    value: 'RevealOrders',
    label: 'Reveal Orders',
  },
]

const DROPDOWN_OPTS_FILEFORMAT = [
  {
    value: 'json',
    label: 'JSON',
  },
  {
    value: 'csv',
    label: 'CSV',
  },
]

const DROPDOWN_OPTS_HOUR = [
  { value: -1, label: '' },
  ...RECCURENCE_UNITS.HOURS.map(hour => ({
    value: hour,
    label: `${hour}:00`,
  })),
]

const DROPDOWN_OPTS_DAY = [
  { value: -1, label: '' },
  ...RECCURENCE_UNITS.DAYS.map(day => ({
    value: day,
    label: day,
  })),
]

// const DROPDOWN_OPTS_RECCURENCE_TYPE = Object.values(RECCURENCE_TYPES).map((type) => ({
//   value: type,
//   label: <FormattedMessage id={`export-feeds-io.${type}`} />,
// }))

// const DROPDOWN_OPTS_RECCURENCE_TYPE = [
//   {value: 'HOURLY', label: 'Hourly' },
//   {value: 'DAILY', label: 'Daily' },
//   {value: 'MONTHLY', label: 'Monthly' }
// ]

// const getReccUnitsOpsByType = (reccType) => {
//   const reccUnits =  RECCURENCE_UNITS[reccType] ?? []
//   return reccUnits.map((unit) => ({
//     value: unit,
//     label: unit
//   }))
// }

interface AddFeedModalProps {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  addFeed: (feed: ServiceRequest) => void
}

const AddFeedModal = (props: AddFeedModalProps) => {
  const { modalOpen, setModalOpen, addFeed } = props
  const [newFeed, setNewFeed] = useState<ServiceRequest>({
    fileformat: '',
    collectionId: '',
    feedType: '',
    updateHour: -1,
    updateDay: -1,
  })

  const handleResetState = () => {
    setNewFeed({
      fileformat: '',
      collectionId: '',
      feedType: '',
      updateHour: -1,
      updateDay: -1,
    })
  }

  const handleClose = () => {
    setModalOpen(false)
    handleResetState()
  }

  const handleAddFeed = () => {
    addFeed(newFeed)
    setModalOpen(false)
    handleResetState()
  }

  const checkClose = (): boolean => {
    return (
      // newFeed.collectionId.length > 0 &&
      newFeed.fileformat.length > 0 && newFeed.feedType.length > 0
    )
  }

  const renderBottomBar = () => (
    <div className="nowrap">
      <span className="mr4">
        <Button variation="tertiary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </span>
      <span>
        <Button
          disabled={!checkClose()}
          variation="secondary"
          onClick={() => handleAddFeed()}
        >
          Save
        </Button>
      </span>
    </div>
  )

  const renderAddFeed = () => {
    return (
      <>
        <div className="mv4">
          <Dropdown
            label="Service Type*"
            placeholder="Service Type"
            options={DROPDOWN_OPTS_SERVICE_TYPE}
            value={newFeed.feedType}
            onChange={(_: any, v: string) =>
              setNewFeed({ ...newFeed, feedType: v })
            }
            required={true}
          />
        </div>
        <div className="mv4">
          <Dropdown
            label="Feed Format*"
            placeholder="Feed Format"
            options={DROPDOWN_OPTS_FILEFORMAT}
            value={newFeed.fileformat}
            onChange={(_: any, v: string) =>
              setNewFeed({ ...newFeed, fileformat: v })
            }
            required={true}
          />
        </div>
        <div className="mv4">
          <Input
            type="text"
            label="Collection ID"
            placeholder="Collection ID"
            value={newFeed.collectionId}
            onChange={(e: any) =>
              setNewFeed({ ...newFeed, collectionId: e.target.value })
            }
            required={true}
          />
        </div>
        <div className="mv4">
          <Dropdown
            label="Hour of Update"
            placeholder="Hour of Update"
            options={DROPDOWN_OPTS_HOUR}
            value={newFeed.updateHour}
            onChange={(_: any, v: number) =>
              setNewFeed({ ...newFeed, updateHour: 1 * v })
            }
            helpText={
              <span>(Optional) Set the hour to update every day / month</span>
            }
            required={false}
          />
        </div>
        <div className="mv4">
          <Dropdown
            label="Day of Update"
            placeholder="Day of Update"
            options={DROPDOWN_OPTS_DAY}
            value={newFeed.updateDay}
            onChange={(_: any, v: number) =>
              setNewFeed({ ...newFeed, updateDay: 1 * v })
            }
            required={false}
            helpText={<span>(Optional) Set the day to update every month</span>}
          />
        </div>
      </>
    )
  }

  return (
    <Modal
      isOpen={modalOpen}
      title="Generate new"
      responsiveFullScreen
      centered
      bottomBar={renderBottomBar()}
      onClose={() => handleClose()}
    >
      {renderAddFeed()}
    </Modal>
  )
}

export default AddFeedModal
