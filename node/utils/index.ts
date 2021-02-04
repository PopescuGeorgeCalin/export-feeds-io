// import { FORMATS } from '../constants'
// import { parse } from 'json2csv'

// export const csvExport = (
//   mappedProducts: any[],
//   fields: string[],
//   feedType: string,
//   header = false
// ) => {
//   const timestamp = +new Date()

//   const opts = { fields, header }
//   const parseResult = parse(mappedProducts, opts)
//   const filename = `${feedType}-${timestamp}.csv`

//   return {
//     filename,
//     feedType,
//     csv: parseResult,
//     date: new Date().toISOString(),
//   }
// }

// export const parseResult = (feed: FeedInfo, collectResult: any) => {
//   // Convert to the desired output format
//   if (feed.fileformat === FORMATS.CSV) {
//     return csvExport(
//       collectResult,
//       Object.keys(collectResult[0]),
//       feed.feedType
//     ).csv
//   } else if (feed.fileformat === FORMATS.JSON) {
//     return JSON.stringify(collectResult)
//   }
//   console.log('ERR: Invalid feed format: ', feed.fileformat)
//   return false
// }

export const getFilenameFromLink = (link: string): string => {
  const regexp = /[^/]*$/.exec(link)

  if (!regexp) return ''

  const name = regexp[0]

  return name
  // return name.substring(0, name.lastIndexOf('.'))
}

// //var csv is the CSV file with headers
// export const csvToJSON = (csv: string) => {
//   var lines = csv.split('\n')

//   var result = []

//   // NOTE: If your columns contain commas in their values, you'll need
//   // to deal with those before doing the next step
//   // (you might convert them to &&& or something, then covert them back later)
//   // jsfiddle showing the issue https://jsfiddle.net/
//   var headers: Record<any, any> = lines[0].split(',')

//   for (var i = 1; i < lines.length; i++) {
//     var obj = {}
//     var currentline = lines[i].split(',')

//     for (var j = 0; j < headers.length; j++) {
//       obj[headers[j]] = currentline[j]
//     }

//     result.push(obj)
//   }

//   //return result; //JavaScript object
//   return JSON.stringify(result) //JSON
// }
