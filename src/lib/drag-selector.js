/* no-did-mount-set-state: 0 */

import React from 'react';
import './drag-selector.scss';

const config = {
  padding: 4
};

export default class DragSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDragging: false };
  }

  componentDidMount() {
    // This may be an actual case for using setState here.
    // TODO: Investigate.
    this.setState({
      bounds: this.refs.wrapper.getBoundingClientRect()
    });
  }

  _yPos(e) {
    return e.clientY - this.state.bounds.top;
  }

  _xPos(e) {
    return e.clientX - this.state.bounds.left;
  }

  _checkColisions(e, height, width) {
    console.log(this.state.bounds);
    return [ false ];
  }

  _handleMouseDown(e) {
    e.preventDefault();
    const wrapper = this.state.bounds;

    const hasCollisions = this._checkColisions(e).some(item => item);
    if (hasCollisions) return;

    this.setState({
      isDragging: true,
      startY: e.clientY - wrapper.top,
      startX: e.clientX - wrapper.left,
      indicator: {
        sy: e.clientY - wrapper.top,
        sx: e.clientX - wrapper.left,
        ey: e.clientY - wrapper.top,
        ex: e.clientX - wrapper.left
      }
    });
  }

  _handleMouseMove(e) {
    e.preventDefault();
    if (!this.state.isDragging) return;

    const wrapper = this.state.bounds;
    const startY = this.state.startY;
    const startX = this.state.startX;
    const offsetY = this._yPos(e);
    const offsetX = this._xPos(e);

    // Hit the no-fly zone?
    if (offsetY >= wrapper.height - config.padding ||
        offsetY <= config.padding ||
        offsetX <= config.padding ||
        offsetX >= wrapper.width - config.padding) {
      this.setState({
        isDragging: false
      });

      return;
    }

    this.setState({
      isDragging: true,
      indicator: {
        sy: startY,
        sx: startX,
        ey: offsetY,
        ex: offsetX
      }
    });
  }

  _handleMouseUp(e) {
    e.preventDefault();

    this.setState({
      isDragging: false,
      startY: 0,
      startX: 0,
      indicator: {
        sy: 0,
        sx: 0,
        ey: 0,
        ex: 0
      }
    });
  }

  renderIndicator() {
    const wrapper = this.refs.wrapper.getBoundingClientRect();
    const st = this.state.indicator;
    const sY = st.sy;
    const sX = st.sx;
    const eY = st.ey;
    const eX = st.ex;

    return (
      <div className='selection-indicator'>
        <svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox={`0 0 ${wrapper.width} ${wrapper.height}`}>
          <polygon points={`${sX} ${sY}, ${eX} ${sY}, ${eX} ${eY}, ${sX} ${eY}`}
                   className='selection-indicator__overlay' />
        </svg>
      </div>
    );
  }

  render() {
    return (
      <div onMouseDown={this._handleMouseDown.bind(this)}
           onMouseMove={this._handleMouseMove.bind(this)}
           onMouseUp={this._handleMouseUp.bind(this)}
           className='drag-select-wrapper'
           ref='wrapper'>
        {this.state.isDragging ? this.renderIndicator() : null}
        {this.props.children}
      </div>
    );
  }
}
