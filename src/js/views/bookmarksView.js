import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessege = 'No Bookmarks yet. Find a nice recipe and bookmark it!';
  _messege = '';
  _generateMarkup() {
    return previewView.previewMarkup(this._data);
  }
}
export default new BookmarksView();
