import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert } from 'vtex.styleguide'

class Toast extends Component<Props> {
  public state = {
    isClosing: false,
  }

  public static defaultProps = {
    autoClose: 4000,
  }

  private openTimeout: any
  private closeTimeout: any

  public componentDidMount() {
    this.openTimeout = setTimeout(() => {
      this.setState({ isClosing: true }, () => {
        this.closeTimeout = setTimeout(() => {
          this.props.onClose
        }, 4000)
      })
    }, this.props.autoClose)
  }

  public componentWillUnmount() {
    clearTimeout(this.openTimeout)
    clearTimeout(this.closeTimeout)
  }

  public render() {
    const { isClosing } = this.state
    const { onClose } = this.props

    return (
      <div
        className={`animated ${
          isClosing ? 'fadeOutDown' : 'fadeInUp'
        }  bottom--1 fixed z-5 ma7-ns mb5-s right-2-ns w-100-s w-30-ns`}
      >
        <Alert type="success" onClose={onClose}>
          <FormattedMessage id={'export-feeds-io.toast.success'} />
        </Alert>
      </div>
    )
  }
}

interface Props {
  autoClose: number
  onClose: () => void
}

export default Toast
