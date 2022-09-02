// ## 🎯 step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기

// TODO 서버 요청 부분
// - [ ] 웹 서버를 띄운다.
// - [ ] 서버에 새로운 메뉴가 추가될 수 있도록 요청한다.
// - [ ] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [ ] 서버에 메뉴가 수정 될 수 있도록 요청한다.
// - [ ] 서버에 메뉴의 품절상태가 토글될 수 있도록 요청한다.
// - [ ] 서버에 메뉴가 삭제 될 수 있도록 요청한다.

// TODO 리팩토링
// - [ ] localStorage에 저장하는 로직은 지운다.
// - [ ] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.
// - [ ] 중복되는 메뉴는 추가할 수 없다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

function App() {
  // 카테고리별로 메뉴 관리
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  // 현재 카테고리에 대한 정보
  // 페이지 접근시 최소 데이터는 에스프레소 메뉴를 그려줘야 하기 때문에
  // espresso로 초기화
  this.currentCategory = "espresso";

  // App이라는 함수가 하나의 객체로 인스턴스로 생성될 때
  // localStorage에 있는 데이터들을 불러온다.
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `
        <li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            item.isSoldOut ? "sold-out" : ""
          }">${item.name}</span>
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
        </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    // 상태로 메뉴 갯수 관리
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("메뉴를 입력해주세요.");
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
    }

    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    // data 속성은 dataset속성으로 접근할 수 있다.
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    // 화면에 솔드아웃된 상태를 보여주기
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      // 기본적으로 html속성에 대문자를 사용할 수 없다. 그래서 보통 '-'를 이용해서 긴 단어의 속성을 작성한다.
      // 이걸 dataset이라는 객체를 통해 가져올때 camelCase로 변환이 된다.
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  // 이 함수 안에 eventListener를 계속 추가하면 된다.
  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        // 뒷부분은 체크할 필요가 없으니 return 해준다.
        // 불필요한 밑에 연산들이 실행할 필요가 없어지니까.
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });
    // 각각의 button에 eventListener를 붙이는 것은 비효율적이다.
    // 각각의 button 태그들의 상위태그인 nav에 이벤트를 달아 놓으면 효율적으로 관리할 수 있다.
    $("nav").addEventListener("click", changeCategory);
  };
}

// new키워드를 사용하여 생성자 함수를 호출하 게 되면 이때의 this는 "만들어진 객체"를 참조한다.
// 맨 처음 페이지에 접근했을 때 App이라는 객체가 생성이 되고,
const app = new App();
// 객체의 init 메소드를 실행!
app.init();
