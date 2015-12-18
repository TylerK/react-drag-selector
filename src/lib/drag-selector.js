/* no-did-mount-set-state: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import './drag-selector.scss';

const config = {
  padding: 2
};

export default class DragSelectionWrapper extends React.Component {
  static propTypes() {
    return {
      children: React.PropTypes.element.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { isDragging: false };
  }

  componentDidMount() {
    this.bounds = this.refs.wrapper.getBoundingClientRect();
  }

  /*
   * Utility: Return y mouse position relative to the wrapper
   * @param {object} e - Synthetic Event
   * @return {number}
   */
  _yPos(e) {
    return e.clientY - this.bounds.top;
  }

  /*
   * Utility: Return x mouse position relative to the wrapper
   * @param {object} Synthetic Event
   * @return {number}
   */
  _xPos(e) {
    return e.clientX - this.bounds.left;
  }

  /*
   * Utility: Return true \ false if the mouse is inside the bounds
   * of a child <SelectionTarget> element.
   * @param {object} e - Synthetic Event
   * @return {number}
   */
  _checkCollisions(e) {
    return this.props.children
    .map(child => {
      const wrapper = this.bounds;
      const ey = this._yPos(e);
      const ex = this._xPos(e);
      const elem = ReactDOM.findDOMNode(child);
      const rect = elem.getBoundingClientRect();

      return ey <= rect.bottom &&
             ey >= rect.top &&
             ex >= rect.left &&
             ex <= rect.right;
    })
    .some(isCollided => isCollided);
  }

  /*
   * Mouse down event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseDown(e) {
    e.preventDefault();
    const wrapper = this.bounds;
    const isCollided = this._checkCollisions(e);

    console.log('BOOM:', isCollided);
    if (isCollided) return;

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

  /*
   * Mouse movement event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseMove(e) {
    e.preventDefault();
    if (!this.state.isDragging) return;

    const wrapper = this.bounds;
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
      indicator: { sy: startY, sx: startX, ey: offsetY, ex: offsetX }
    });
  }

  /*
   * Mouse up event handler logic.
   * @param {object} e - Synthetic Event
   */
  _handleMouseUp(e) {
    e.preventDefault();

    this.setState({
      isDragging: false,
      startY: 0,
      startX: 0,
      indicator: { sy: 0, sx: 0, ey: 0, ex: 0 }
    });
  }

  /*
   * Render sub method used to draw the selection box
   */
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
