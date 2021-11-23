import store from './store/index.js';
import MenuApi from './api/index.js';
import { $ } from './utils/dom.js';


function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  }

  const createMenuItemTemplate = (item) => {
    return (`
      <li data-menu-id="${item.id}" class="menu-list-item d-flex items-center py-2">
        <span class="${item.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${item.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>
    `);
  }

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    const templates = this.menu[this.currentCategory].map((item, index) => createMenuItemTemplate(item, index)).join('');
    $('#menu-list').innerHTML = templates;
    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };
  
  const addMenuName = async () => {
    const menuName = $('#menu-name').value;      
    if (menuName === '') {
      alert('값을 입력해주세요!');
      return;
    }
  
    const isDuplicatedItem = this.menu[this.currentCategory].find(
      menuItem => menuItem.name === menuName
    );

    if (isDuplicatedItem) {
      alert('중복된 메뉴 이름입니다. 다시 입력해주세요');
      $('#menu-name').value = '';
      return;
    }

    await MenuApi.addMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
  };

  const editMenuName = async (event) => {
    const menuId = event.target.closest('li').dataset.menuId;
    const $menuName = event.target.closest('li').querySelector('.menu-name')
    const edittedMenuName = prompt('수정할 메뉴명을 입력하세요', $menuName.innerText);
    if (edittedMenuName == null) return;
    await MenuApi.editMenu(this.currentCategory, menuId, edittedMenuName);
    render();
  };

  const deleteMenuName = async (event) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      const menuId = event.target.closest('li').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (event) => {
    const menuId = event.target.closest('li').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (event) => {
    const isCategoryButton = event.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const clickedCategoryName = event.target.dataset.categoryName;
      $('#category-title').innerText = `${event.target.innerText} 메뉴 관리`;
      this.currentCategory = clickedCategoryName;
      render();
    }
  };

  const initEventListeners = () => {
    $('#menu-list')
    .addEventListener('click', (event) => {
      const checkButtonType = (type) => event.target.classList.contains(`menu-${type}-button`);

      if (checkButtonType('edit')) {
        editMenuName(event);
        return;
      }

      if (checkButtonType('remove')) {
        deleteMenuName(event);
        return;
      }

      if (checkButtonType('sold-out')) {
        soldOutMenu(event);
        return;
      }
    });

    $('#menu-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
      });

    $('#menu-name')
      .addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          addMenuName();
        }
      });

    $('#menu-submit-button')
      .addEventListener('click', addMenuName);

    $('nav').addEventListener('click', changeCategory);
  }
}

const app = new App();
app.init();
