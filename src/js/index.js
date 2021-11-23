const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage(menu) {
    return JSON.parse(localStorage.getItem(menu));
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
  this.init = () => {
    if (store.getLocalStorage('menu')) {
      this.menu = store.getLocalStorage('menu');
    }
    render();
  }

  const render = () => {
    const menuItemTemplate = (menuName, index) => {
      return (`
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${menuName}</span>
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

    const templates = this.menu[this.currentCategory].map((item, index) => menuItemTemplate(item.name, index)).join('');
    $('#menu-list').innerHTML = templates;

    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = $('#menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };
  
  const addMenuName = () => {
    const menuName = $('#menu-name').value;      
    if (menuName === '') {
      alert('값을 입력해주세요!');
      return;
    }
  
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);

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
    $menuName.innerText = edittedMenuName;
  };

  const removeMenuName = (event) => {
    if(confirm('정말로 삭제하시겠습니까?')) {
      const menuId = event.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      event.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#menu-list')
    .addEventListener('click', (event) => {
      const checkButtonType = (type) => event.target.classList.contains(`menu-${type}-button`);

      if (checkButtonType('edit')) {
        editMenuName(event);
      }

      if (checkButtonType('remove')) {
        removeMenuName(event);
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

  })
}

const app = new App();
app.init();
