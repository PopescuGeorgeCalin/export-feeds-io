import _ from 'lodash'
import htmlToText from 'html-to-text'

export const limitSize = (limit: number): ((str: string) => string) => {
  return (str: string) => str.substring(0, limit)
}

export const identity = (field: any) => field

export const replaceNewLine = (
  replaceWith: string
): ((str: string) => string) => {
  return (str: string) => str.replace(/\n|\r/g, replaceWith)
}

export const compose = (
  funcs: Array<(str: string) => string>
): ((str: string) => string) => {
  return _.flow(funcs)
}

export const removeHtmlTags = (): ((str: string) => string) => (str: string) =>
  htmlToText.fromString(str, {
    wordwrap: 1000,
  })

export const limitDecimals = (limit: number): ((nr: number) => number) => (
  nr: number
) => parseFloat(nr.toFixed(limit))
