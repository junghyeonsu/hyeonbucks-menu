const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage(menu) {
    return localStorage.getItem(menu);
  },
};

function App() {
  this.menu = [];

  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };
  
  const addEspressoMenuName = () => {
    const expressoMenuName = $('#espresso-menu-name').value;      
    // 빈 값일때 예외 처리
    if (expressoMenuName === '') {
      alert('값을 입력해주세요!');
      return;
    }
  
    this.menu.push({ name: expressoMenuName });
    store.setLocalStorage(this.menu);

    const menuItemTemplate = (expressoMenuName) => {
      return (`
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${expressoMenuName}</span>
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
  
    const templates = this.menu.map(item => menuItemTemplate(item.name)).join('');
    console.log(templates);
    $('#espresso-menu-list').innerHTML = templates;
  
    updateMenuCount();
  
    // 엔터치면 input 값을 비워준다.
    $('#espresso-menu-name').value = '';
  };

  const editMenuName = (event) => {
    const $menuName = event.target.closest('li').querySelector('.menu-name')
    const edittedMenuName = prompt('수정할 메뉴명을 입력하세요', $menuName.innerText);
    if (edittedMenuName == null) return;
    $menuName.innerText = edittedMenuName;
  };

  const removeMenuName = (event) => {
    if(confirm('정말로 삭제하시겠습니까?')) {
      event.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#espresso-menu-list')
    .addEventListener('click', (event) => {
      const checkButtonType = (type) => event.target.classList.contains(`menu-${type}-button`);

      if (checkButtonType('edit')) {
        editMenuName(event);
      }

      if (checkButtonType('remove')) {
        removeMenuName(event);
      }
    });

  $('#espresso-menu-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
    });

  $('#espresso-menu-name')
    .addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        addEspressoMenuName();
      }
    });

  $('#espresso-menu-submit-button')
    .addEventListener('click', addEspressoMenuName);
}

App();
