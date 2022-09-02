const store = {
  setLocalStorage(menu) {
    // localStorage는 문자열로만 저장해야한다.
    // JSON 객체 형태를 문자열로 저장하기 위해서 JSON.stringify 메소드를 사용한다.
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    // 문자열로 가져온 것을 JSON 객체로 변환해줘야 한다.
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
