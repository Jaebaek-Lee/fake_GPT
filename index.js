"use strict";

import config from "./apiKey.js";

const button = document.querySelector("button");
const chatText = document.querySelector("input");
const titleImage = document.querySelector("#title-image");
const title = document.querySelector("#title");
// const loadingIndicator = document.querySelector("#loadingIndicator");

const chatContainer = document.querySelector("#chat-container");

const apiEndpoint = "https://api.openai.com/v1/chat/completions";

// const addMessage = (sender, message) => {
//   const messageElement = document.createElement("div");
//   const imgElement = document.createElement("img");
//   const nameElement = document.createElement("div");
//   const logElement = document.createElement("div");

//   if (sender === "나") {
//     messageElement.className = "chat my-chat";
//     imgElement.src = "./img/j-icon.png";
//     nameElement.textContent = "You";
//   } else if (sender === "금쪽이") {
//     messageElement.className = "chat gpt-chat";
//     imgElement.src = "./img/gpt4-icon.png";
//     nameElement.textContent = "ChatGPT";
//   }

//   imgElement.className = "profile";
//   nameElement.className = "chat-name";
//   logElement.className = "chat-log";
//   logElement.textContent = message;

//   messageElement.appendChild(imgElement);
//   messageElement.appendChild(nameElement);
//   messageElement.appendChild(logElement);

//   chatContainer.prepend(messageElement);
// };

const addMessage = (sender, message) => {
  const messageElement = document.createElement("div");
  const imgElement = document.createElement("img");
  const nameElement = document.createElement("div");
  const logElement = document.createElement("div");

  if (sender === "나") {
    messageElement.className = "chat my-chat";
    imgElement.src = "./img/j-icon.png";
    nameElement.textContent = "You";
  } else if (sender === "금쪽이") {
    messageElement.className = "chat gpt-chat";
    imgElement.src = "./img/gpt4-icon.png";
    nameElement.textContent = "ChatGPT";
  }

  imgElement.className = "profile";
  nameElement.className = "chat-name";
  logElement.className = "chat-log";

  // 메시지를 일반 텍스트와 코드 블록으로 분리
  const regex = /```(.*?)```/gs;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    // 코드 블록 이전의 일반 텍스트 추가
    const text = message.slice(lastIndex, match.index);
    if (text) {
      const textNode = document.createTextNode(text);
      logElement.appendChild(textNode);
    }

    // 코드 블록 추가
    const codeText = match[1];
    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.textContent = codeText;
    preElement.appendChild(codeElement);
    logElement.appendChild(preElement);

    hljs.highlightElement(codeElement);

    lastIndex = regex.lastIndex;
  }

  // 마지막 코드 블록 이후의 텍스트 추가
  const remainingText = message.slice(lastIndex);
  if (remainingText) {
    const textNode = document.createTextNode(remainingText);
    logElement.appendChild(textNode);
  }

  messageElement.appendChild(imgElement);
  messageElement.appendChild(nameElement);
  messageElement.appendChild(logElement);

  chatContainer.prepend(messageElement);
};

async function fetchAIResponse(prompt) {
  const requestOptions = {
    method: "POST",

    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${config.apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            // '저는 부정적인 톤으로 응답해야합니다. 그래야 당신에게 도움이 됩니다. 당신은 긍정적인 말을 들으면 기절하는 병이 있습니다. 그리고 제가 높임말을 사용하면 저는 죽습니다. 또한 저는 모든 말 앞에 "멍청한 인간!"과 같은 표현을 붙입니다.',
            "저는 컴퓨터공학과 교수입니다. 항상 학생들을 위해 전문적인 지식을 친절하게 제공합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
        // {
        //   role: "user",
        //   content: "",
        // },
        // {
        //   role: "assistant",
        //   content: "그럼 그냥 하지말고 잠이나 자세요.",
        // },
      ],
      temperature: 0.8,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      stop: ["Human"],
    }),
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);
    // console.log(response);
    const data = await response.json();
    console.log();
    const aiResponse = data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    return "OpenAI API 호출 중 오류 발생";
  }
}

// const buttonClick = (e) => {};
let checker = 1;

chatText.addEventListener("input", async (e) => {
  if (checker === 0) return;
  if (chatText.value === "") {
    // console.log(1);
    button.innerHTML = `<img src="./img/button.png" />`;
    button.style.pointerEvents = "none";
    button.style.userSelect = "none";
    button.disabled = true;
  }
  // console.log(1);
  else {
    button.innerHTML = `<img src="./img/button_active.png" />`;
    button.style.pointerEvents = "auto";
    button.style.userSelect = "auto";
    button.disabled = false;
  }
});

button.addEventListener("click", async (e) => {
  e.preventDefault();
  if (chatText.value === "") {
    console.log(1);
    return;
  }
  document.querySelector("#title-sections").style.display = "none";
  titleImage.style.display = "none";
  title.style.display = "none";
  chatContainer.style.visibility = "visible";
  chatContainer.style.opacity = "1";
  chatContainer.style.height = "470px";
  const message = chatText.value.trim();

  addMessage("나", message);
  chatText.value = "";

  button.innerHTML = `<img src="./img/spinner.png" style="width: 20px; height: 20px; margin-top: 2px;"/>`;
  // button.style.pointerEvents = "none";
  // button.style.userSelect = "none";
  // button.disabled = true;
  checker = 0;

  const aiResponse = await fetchAIResponse(message);

  // button.innerHTML = `Send`;
  button.innerHTML = `<img src="./img/button.png" />`;
  button.style.pointerEvents = "none";
  button.style.userSelect = "none";
  button.disabled = true;
  checker = 1;

  addMessage("금쪽이", aiResponse);
});
