import React from 'react';
import './drag-selector.scss';

export default class DragSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDragging: false };
  }

  _handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const wrapper = this.refs.wrapper.getBoundingClientRect();

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

    const wrapper = this.refs.wrapper.getBoundingClientRect();

    const startY = this.state.startY;
    const startX = this.state.startX;
    const offsetY = e.clientY - wrapper.top;
    const offsetX = e.clientX - wrapper.left;

    // TODO add a no-fly zone that
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
