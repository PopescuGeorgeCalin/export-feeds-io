import React from 'react'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import Container from './components/Container'
import './style.css'

const Feeds = () => {
  const headerTitle = <FormattedMessage id="export-feeds-io.header.title" />
  const blockTitle = <FormattedMessage id="export-feeds-io.block.title" />

  return (
    <Layout pageHeader={<PageHeader title={headerTitle} />}>
      <PageBlock variation="full" title={blockTitle}>
        <Container />
      </PageBlock>
    </Layout>
  )
}

export default Feeds
