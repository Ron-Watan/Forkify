import View from './view.js';
import icons from 'url:../../img/icons.svg';
// Child-class to generate preview of html to resultsView and bookmarksView
class PreviewView extends View {
  previewMarkup(recipeData) {
    const idActive = window.location.hash.slice(1);
    return recipeData
      .map(data => {
        return `
    <li class="preview">
    <a class="preview__link ${
      idActive === data.id ? 'preview__link--active' : ''
    }" href="#${data.id}">
      <figure class="preview__fig">
        <img src="${data.image}" alt="${data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${data.title}</h4>
        <p class="preview__publisher">${data.publisher}</p>
        <div class="preview__user-generated ${!data.key && 'hidden'}">
        <svg>
        <use href="${icons}#icon-user"></use>
        </svg>
      </div>
     
      </div>
      
    </a>
  </li>
    `;
      })
      .join('');
  }
}
export default new PreviewView();
