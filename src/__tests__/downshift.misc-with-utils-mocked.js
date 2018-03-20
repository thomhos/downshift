// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import React from 'react'
import {render, Simulate} from 'react-testing-library'
import Downshift from '../'
import {scrollIntoView} from '../utils'

jest.useFakeTimers()
jest.mock('../utils')

test('does not scroll from an onMouseMove event', () => {
  class HighlightedIndexController extends React.Component {
    state = {highlightedIndex: 10}
    handleStateChange = changes => {
      if (changes.hasOwnProperty('highlightedIndex')) {
        this.setState({highlightedIndex: changes.highlightedIndex})
      }
    }
    render() {
      return (
        <Downshift
          onStateChange={this.handleStateChange}
          highlightedIndex={this.state.highlightedIndex}
          render={({getInputProps, getItemProps}) => (
            <div>
              <input data-testid="input" {...getInputProps()} />
              <div {...getItemProps({item: 'hi', 'data-testid': 'item-1'})} />
              <div {...getItemProps({item: 'hey', 'data-testid': 'item-2'})} />
            </div>
          )}
        />
      )
    }
  }
  const {queryByTestId} = render(<HighlightedIndexController />)
  const input = queryByTestId('input')
  const item = queryByTestId('item-1')
  Simulate.mouseMove(item)
  jest.runAllTimers()
  expect(scrollIntoView).not.toHaveBeenCalled()
  // now let's make sure that we can still scroll items into view
  // ↓
  Simulate.keyDown(input, {key: 'ArrowDown'})
  expect(scrollIntoView).toHaveBeenCalled()
})
