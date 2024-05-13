onload = () => {
  const c = setTimeout(() => {
    var audio = document.getElementById('Orchestra');
    audio.volume = 0.05;
    audio.currentTime = 0;
    audio.play();
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  setTimeout(() => {
    let main = document.querySelector(".main");
    main.style.opacity = "1";
  }, 4000);

  // Text
  var writeSFX = document.getElementById('Writing');
  const p = document.getElementById('paragraph');
  const text = `Happy Mothers Day to the most AMAZING, HARDWORKING, THOUGHTFUL mother in the world. For my whole life there has never been a single moment in time where I wasn't able to count on you, mum. You would always sacrifice for us to make sure that we had, even if it meant that you had to leave yourself undone. None of your sacrifices and all the things you do for us go unnoticed, not one bit, and the moment I graduate and get my job, I will do the same for you. You have always been there for us and always been the one person in our lives that we know we can always count on. That's why we would prefer to ask you instead of him, because even if you can't you'll still find away, no complaints. We have never once in our lives felt second to anyone in your life, we've always came first when it comes to you and there is no end to our appreciation for you for that. We've never once had to think "You care about this person more than us", not ONCE. You deserve this break more than anyone in the world. Even though you were supposed to have your breaks during the divorce, you were not bothered when he kept leaving you with us in the time that you were supposed to have by yourself, you just made the sacrifice and made sure we were good. I know we give you a hard time sometimes, and sometimes it may seem unbearable, but we appreciate you and love you more than anything. I am grateful to the Lord for blessing me with the best mother in the world. You've always been supportive and pushed us to the most of our abilities to excel in anything we did. I wouldn't be here if it wasn't for you, both physically and figuratively. You're my biggest role model and motivation. Thank you for everything you have given us, and I hope you're having the best vacation and rehabilitating yourself while you're up there, you need it more than anything, and deserve it more than anyone. Thank you for being the best Mother and parent we could ever ask for.<br>We Love You.<br><br>Sincerely,<br>Your Boys + Duchess♡<br><br><br><br><br><br>♡`;
  let html = '';
  let i = 0;

  function displayText() {
    if (i == 0) {
      writeSFX.volume = 0.1;
      writeSFX.currentTime = 0;
      writeSFX.play();
    }
    if (i < text.length) {
      html += text[i];
      p.innerHTML = html;
      i++;
      setTimeout(displayText, 10); // Adjust the delay as needed
    } else {
      writeSFX.pause();
      document.querySelector(".carousel").style.opacity = 1;
    }
    
  }
    
  setTimeout(displayText, 6000);
};


let isScrolling = false;
function scrollPrev() {
    if (isScrolling) return;
    isScrolling = true;

    const container = document.querySelector(".image-list");
    container.scrollLeft -= container.clientWidth;

    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

function scrollNext(genre) {
    if (isScrolling) return;
    isScrolling = true;

    const container = document.querySelector(".image-list");
    container.scrollLeft += container.clientWidth;

    setTimeout(() => {
        isScrolling = false;
    }, 500);
}