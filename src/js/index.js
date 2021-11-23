import store from './store/index.js';
import { $ } from './utils/dom.js';

const BASE_URL = 'http://localhost:3000/api';

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
};

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

  const render = () => {
    const menuItemTemplate = (item, index) => {
      return (`
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="${item.soldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${item.name}</span>
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

    const templates = this.menu[this.currentCategory].map((item, index) => menuItemTemplate(item, index)).join('');
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
  
    // this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      return response.json();
    });

    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    $('#menu-name').value = '';
  };

  const editMenuName = (event) => {
    const menuId = event.target.closest('li').dataset.menuId;
    const $menuName = event.target.closest('li').querySelector('.menu-name')
    const edittedMenuName = prompt('수정할 메뉴명을 입력하세요', $menuName.innerText);
    if (edittedMenuName == null) return;
    this.menu[this.currentCategory][menuId].name = edittedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (event) => {
    if(confirm('정말로 삭제하시겠습니까?')) {
      const menuId = event.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (event) => {
    const menuId = event.target.closest('li').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = 
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  }

  const initEventListeners = () => {
    $('#menu-list')
    .addEventListener('click', (event) => {
      const checkButtonType = (type) => event.target.classList.contains(`menu-${type}-button`);

      if (checkButtonType('edit')) {
        editMenuName(event);
        return;
      }

      if (checkButtonType('remove')) {
        removeMenuName(event);
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

    $('nav').addEventListener('click', (event) => {
      const isCategoryButton = event.target.classList.contains('cafe-category-name');
      if (isCategoryButton) {
        const clickedCategoryName = event.target.dataset.categoryName;
        $('#category-title').innerText = `${event.target.innerText} 메뉴 관리`;
        this.currentCategory = clickedCategoryName;
        render();
      }
    });
  }
}

const app = new App();
app.init();
