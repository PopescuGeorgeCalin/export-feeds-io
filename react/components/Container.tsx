// import React, { Component } from 'react'
// import axios from 'axios'
// import { Modal, Spinner, Button, Input, Table } from 'vtex.styleguide'

import React, { useState } from 'react'

import AddFeedModal from './AddFeedModal'
import FeedTable from './FeedTable'
import Toast from './Toast'
import { useFeeds } from '../hooks/useFeeds'

const Container = () => {
  const [feeds, deleteFeed, addFeed] = useFeeds()
  const [modalOpen, setModalOpen] = useState(false)
  const [showToast, setShowToast] = useState<boolean>(false)

  const handleDeleteItem = async (rowData: any) => {
    deleteFeed(rowData.filename)
  }

  return (
    <div className="pa3">
      <FeedTable
        feeds={feeds}
        handleDelete={handleDeleteItem}
        setModalOpen={setModalOpen}
        setShowToast={setShowToast}
      />
      <AddFeedModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        addFeed={addFeed}
      />
      {showToast && (
        <Toast key="toast-success" onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}

export default Container
