var CustomCursor = {
  cursorElement: '',
  setCursor: function (cursorId) {
    document.documentElement.style.cursor = 'none';
    this.cursorElement = document.getElementById(cursorId);
    this.updateCursor();
  },
  removeCursor: function () {
    document.documentElement.style.cursor = 'auto';
    document.documentElement.removeEventListener('mousemove', this._cursorEvent);
    this.cursorElement = '';
  },
  updateCursor: function () {
    document.documentElement.addEventListener('mousemove', this._cursorEvent);
  },
  _cursorEvent: function (e) {
    if (CustomCursor._checkHover(e.target)) {
      CustomCursor.cursorElement.classList.add('is-hovered');
    } else {
      CustomCursor.cursorElement.classList.remove('is-hovered');
    }

    /** Mouse Movement */
    CustomCursor.cursorElement.style.left = (e.clientX + 2) + 'px';
    CustomCursor.cursorElement.style.top = (e.clientY + 2) + 'px';
  },
  _checkHover: function (elem) {
    const tag = ['A', 'BUTTON'];
    for (var i = 0; i < tag.length; i++) {
      if (elem.nodeName === tag[i] ||
        elem.parentElement.nodeName === tag[i] ||
        elem.parentElement.parentElement.nodeName === tag[i]) {
        return true;
      }
    }
    return false;
  },
};

CustomCursor.setCursor('cursor');