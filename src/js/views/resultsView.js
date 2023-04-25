import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessege = 'No recipe found for your query! Please try again';
  _messege = '';
  _generateMarkup() {
    return previewView.previewMarkup(this._data);
  }
}
export default new ResultsView();
