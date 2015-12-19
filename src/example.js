import React from 'react';
import { render } from 'react-dom';
import {
  DragSelectionWrapper,
  SelectionTarget
} from './app';

import './example.scss';

class App extends React.Component {
  render() {
    return (
      <DragSelectionWrapper>
        {[1, 2, 3].map((item, i) => {
          return (
            <SelectionTarget ref={`SelectionTarget${i}`} key={`SelectionKey${i}`}>
              <p>Select Me!</p>
            </SelectionTarget>
          );
        })}
      </DragSelectionWrapper>
    );
  }
}

render(React.createElement(App), document.getElementById('app'));
