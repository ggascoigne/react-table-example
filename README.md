# React Table Example

Demo of React Table V7 using TypeScript as well as Material UI

- [Open this example in a new CodeSandbox](https://codesandbox.io/s/github/ggascoigne/react-table-example)
- `yarn` and `yarn start` to run and edit the example

This example uses:
  * `useGroupBy` to enable header groups
  * `useFilters` for per-column filters.  Note that filters are displayed in a separate filter dropdown rather than being embedded in each column header.
  * `useSortBy` for column sorting
  * `useExpanded` to allow expansion of grouped columns
  * `useFlexLayout` for a scalable full width table
  * `usePagination` for pagination
  * `useResizeColumns` for resizable columns
  * `useRowSelect` for row selection
  
Other features:
  * Demonstrates hiding columns.
  * use `react-json-view` to optionally display the table instance for better exploration.
  * use `useLocalStorage` and `useDebounce`, both from https://usehooks.com  to persist table settings.
  

## Inspiration

Several parts of this demo are pulled from examples that are available at https://github.com/tannerlinsley/react-table/tree/master/examples that are copyright Tanner Linsley
