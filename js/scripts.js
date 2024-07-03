window.onload = function () {
  var messagesEl = document.querySelector(".messages");
  var typingSpeed = 20;
  var loadingText = "<b>•</b><b>•</b><b>•</b>";
  var messageIndex = 0;

  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var current = hours + minutes / 60;

  var getCurrentTime = () => {
    if (current >= 5 && current < 18) return "Have a nice day";
    if (current >= 18 && current < 22) return "Have a nice evening";
  };

  var midnightMessages = [
    "It's already late night now ...",
    "Better get some sleep, folks.",
    "Come back again  tomorrow!",
  ];

  var messages = [
    "Hello!",
    "I'm Pram",
    "I am a third year CS student",
    "I love all things about backend development and computer vision",
    "Currently learning how code and compilers work in lower layer",
    'If you have something to discuss, <br>you can contact me at <a href="mailto:ikhwanpramuditha05@gmail.com">ikhwanpramuditha05@gmail.com</a>',
    '<a target="_blank" href="https://www.linkedin.com/in/ikhwanpramuditha/">linkedin.com/in/ikhwanpramuditha</a><br><a target="_blank" href="https://x.com/prammmoee">x.com/prammmoee</a><br><a target="_blank" href="https://github.com/prammmoe">github.com/prammmoe</a><br><a target="_blank" href="https://dribbble.com/prammmoe">dribbble.com/prammmoe</a><br><a target="_blank" href="https://medium.com/@prammmoe">medium.com/@prammmoe</a><br><a target="_blank" href="https://monkeytype.com/profile/prammmoe">monkeytype.com/profile/prammmoe</a>',
    getCurrentTime(),
    "👾",
  ];

  var getFontSize = function () {
    return parseInt(
      getComputedStyle(document.body).getPropertyValue("font-size")
    );
  };

  var pxToRem = function (px) {
    return px / getFontSize() + "rem";
  };

  var createBubbleElements = function (message, position) {
    var bubbleEl = document.createElement("div");
    var messageEl = document.createElement("span");
    var loadingEl = document.createElement("span");
    bubbleEl.classList.add("bubble");
    bubbleEl.classList.add("is-loading");
    bubbleEl.classList.add("cornered");
    bubbleEl.classList.add(position === "right" ? "right" : "left");
    messageEl.classList.add("message");
    loadingEl.classList.add("loading");
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl,
    };
  };

  var getDimentions = function (elements) {
    return (dimensions = {
      loading: {
        w: "4rem",
        h: "2.25rem",
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight),
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight),
      },
    });
  };

  var sendMessage = function (message, position) {
    var loadingDuration =
      message.replace(/<(?:.|\n)*?>/gm, "").length * typingSpeed + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement("br"));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = "0rem";
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750,
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ["0rem", dimensions.loading.w],
      marginTop: ["2.5rem", 0],
      marginLeft: ["-2.5rem", 0],
      duration: 800,
      easing: "easeOutElastic",
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, 0.95],
      duration: 1100,
      loop: true,
      direction: "alternate",
      easing: "easeInOutQuad",
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ["-2rem", "0rem"],
      scale: [0.5, 1],
      duration: 400,
      delay: 25,
      easing: "easeOutElastic",
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll("b"),
      scale: [1, 1.25],
      opacity: [0.5, 1],
      duration: 300,
      loop: true,
      direction: "alternate",
      delay: function (i) {
        return i * 100 + 50;
      },
    });
    setTimeout(function () {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: "forwards",
        update: function (a) {
          if (
            a.progress >= 65 &&
            elements.bubble.classList.contains("is-loading")
          ) {
            elements.bubble.classList.remove("is-loading");
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        },
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w],
        height: [dimensions.loading.h, dimensions.bubble.h],
        marginTop: 0,
        marginLeft: 0,
        begin: function () {
          if (messageIndex < messages.length)
            elements.bubble.classList.remove("cornered");
        },
      });
    }, loadingDuration - 200);
  };

  var sendMessages = function () {
    if (current >= 22 && current <= 5) {
      var message = midnightMessages[messageIndex];
      if (!message) return;
      sendMessage(message);
      ++messageIndex;
      setTimeout(
        sendMessages,
        message.replace(/<(?:.|\n)*?>/gm, "").length * typingSpeed +
          anime.random(700, 1000)
      );
    } else {
      var message = messages[messageIndex];
      if (!message) return;
      sendMessage(message);
      ++messageIndex;
      setTimeout(
        sendMessages,
        message.replace(/<(?:.|\n)*?>/gm, "").length * typingSpeed +
          anime.random(700, 1000)
      );
    }
  };

  sendMessages();

  var hasShownMessages = localStorage.getItem("messagesShown");

  if (!hasShownMessages) {
    // Send messages if not shown before
    sendMessages();
    localStorage.setItem("messagesShown", true);
  }

  // Theme toggle functionality
  var themeToggleButton = document.getElementById("theme-toggle-button");
  // Set initial theme based on local storage
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggleButton.classList.add("moon");
  } else {
    document.body.classList.add("dark-mode");
    themeToggleButton.classList.add("sun");
  }

  themeToggleButton.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      themeToggleButton.classList.remove("sun");
      themeToggleButton.classList.add("moon");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      themeToggleButton.classList.remove("moon");
      themeToggleButton.classList.add("sun");
      localStorage.setItem("theme", "dark");
    }
  });
};
