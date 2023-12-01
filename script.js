$(() => {
  // check the users' preferred color theme - thus the website will default to that theme
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // get the current theme from local storage
  const currTheme = localStorage.getItem("mode");
  
  // choose the theme based on the local storage
  if (currTheme == "dark")
  {
    $('body').toggleClass("dark-mode");
  }
  else if (currTheme == "light")
  {
    $('body').toggleClass("light-mode");
  }

  // toggle the theme on a icon press
  $("#icon").on('click', () => {
    let theme = "";
    if (prefersDarkScheme.matches)
    {
      $('body').toggleClass("light-mode");
      $("i").toggleClass("lni-night lni-sun");
      theme = $('body').hasClass('light-mode') ? "light" : "dark";
    }
    else
    {
      $('body').toggleClass("dark-mode");
      $("i").toggleClass("lni-night lni-sun");
      theme = $('body').hasClass('dark-mode') ? "dark" : "light";
    }
    //set the local storage
    localStorage.setItem("theme", theme);
  });
  
})