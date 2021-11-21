function app() {
  document
    .querySelector('#express-menu-name')
    .addEventListener('keypress', (event) => {
      console.log(event.key);
    });
};

app();
