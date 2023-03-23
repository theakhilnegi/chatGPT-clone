import React, { useState, useEffect } from 'react'
import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loaderIcon from "./assets/loader.svg";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
  }, [posts]);


  const fetchBotResponse = async () => {
    const { data } = await axios.post("https://chatgpt-l1ya.onrender.com", { input: input }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("Rukja re Bhai...", false, true);
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    })
    setInput("");
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== 'bot') {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1)
            })
          }
          else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1)
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }


  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {

      setPosts((prevState) => {
        return [
          ...prevState,
          { type: isLoading ? "loading" : "user", post: post }
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  }

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout" id='layout'>


          {posts.map((post, index) => {
            return (
              <div key={index} className={`chat-bubble ${post.type === "bot" || post.type === "loading" ? "bot" : ""}`}>
                <div className="avatar">
                  <img src={(post.type === "bot" || post.type === "loading") ? bot : user} alt="post type" />
                </div>

                {post.type === "loading" ? (
                  <div className="loader">
                    <img src={loaderIcon} alt="loading" />
                  </div>
                ) : (
                  <div className="post">{post.post}</div>
                )}
              </div>)
          })}


        </div>
      </section>
      <footer>
        <input type="text" className="composebar" autoFocus placeholder="Hii there, Ask Me Something" value={input} onChange={(e) => { setInput(e.target.value) }} onKeyUp={onKeyUp} />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="send" />
        </div>
      </footer>
    </main>
  )
}

export default App;
