const socket = io();

const refs = {
  messageEditor: document.querySelector("#message-editor"),
  feed: document.querySelector("#message-feed"),
  input: document.querySelector("#input"),
};

// Markup историй сообщений
socket.on("user/connected", (history) => {
  const markup = history
    .map(({ author, message, timestamp }) => {
      const { hours, minutes } = getTime(timestamp);

      return `<li>
        <b>${author}</b> ${hours}:${minutes}
        <p>${message}</p>
      </li>`;
    })
    .join("");

  refs.feed.insertAdjacentHTML("beforeend", markup);
});

// Обработчик формы
refs.messageEditor.addEventListener("submit", onEditorSubmit);

function onEditorSubmit(event) {
  event.preventDefault();

  const formData = new FormData(this)
  let data = {};
  formData.forEach((value, key) => data[key] = value);
  socket.emit("chat/newMessage", JSON.stringify(data));

  localStorage.setItem("name", JSON.stringify(data.author))

  event.currentTarget.elements.massage.value = "";
  refs.input.setAttribute("readonly", "readonly")
}

refs.input.value = localStorage.getItem("name")


// Добавление нового сообщения
socket.on("chat/newMessage", appendMessageToFeed);

function appendMessageToFeed({ author, message, timestamp }) {
  const { hours, minutes } = getTime(timestamp);

  const markup = `
  <li>
    <b>${author}</b> ${hours}:${minutes}
    <p>${message}</p>
  </li>`;

  refs.feed.insertAdjacentHTML("beforeend", markup);
  refs.feed.scrollTop = refs.feed.scrollHeight;
}

// Время
function getTime(timestamp) {
  const time = new Date(timestamp);
  const hours = time.getHours();
  const minutes = time.getMinutes();

  return { hours, minutes };
}
