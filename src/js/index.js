// ## 🎯 step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [ ] 메뉴의 이름을 입력 받고 확인 버튼 누르면 메뉴가 추가된다.
// - [ ] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [ ] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창이 뜬다. (브라우저에서 제공하는 `prompt` 인터페이스 사용!)
// - [ ] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [ ] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [ ] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [ ] 총 메뉴 객수를 count하여 상단에 보여준다.

// 자바스크립트 파일을 브라우저에서 불러왔을 때 실행을 되는 것을 만들어야 한다.
// 그래서 App이라는 함수를 만들고
// 이 함수안에 이벤트에 관련된 부분이나 기능들을 구현.

// 유틸함수
// $ 표시는 자바스크립트의 DOM, html의 element를 가져올 때 $표시를 관용적으로 많이 사용한다.
const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };
  // 코드가 중복되기 때문에 재사용할 수 있는 함수로 만들기
  const addMeunName = () => {
    // Enter 키를 입력했을 때 menu-name이 아무 값이 없으면 return
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요.");
      // 뒷부분이 실행 안되게 하기 위해 return 해준다.
      return;
    }
    const espressMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressMenuName) => {
      return `
          <li class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${espressMenuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressMenuName)
    );
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  // 수정을 해주는 부분도 함수로 만들기.
  const updateMenuName = (e) => {
    // 내가 속해있는 가장 가까운 li태그로 찾아서 올라가야 하기 때문에
    // 이럴때 closest메소드를 사용한다.
    // text값을 가져오는 innerText를 사용하여 수정하고 싶은 메뉴 이름을 가져온다.
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하겠습니까?")) {
      // li태그 통으로 삭제해야한다.
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMeunName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    // Enter 키가 아니면 무조건 반환
    if (e.key !== "Enter") {
      return;
    }
    addMeunName();
  });
}

App();
