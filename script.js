console.log(localStorage)

const body = document.body
const inputSearch = document.getElementById("inputSearch")
const result = document.getElementById("result")
const loading = document.getElementById("loading")
const userCard = document.getElementById("user-body")
const lastSearchList = document.getElementById("body-lastSearch")
const buttonSearh = document.getElementById("search")
const buttonClearStorage = document.getElementById("clear-storage")
const buttonChangeTheme = document.getElementById("change-theme")


buttonChangeTheme.addEventListener("click", () => {

  if (theme === null) {
    theme = true
    localStorage.setItem("theme", theme)
    buttonChangeTheme.textContent = "ligth mode"
    return
  }

  if (theme) {
    theme = false
    buttonChangeTheme.textContent = "dark mode"
    localStorage.setItem("theme", theme)
    console.log(`true : ${localStorage.getItem("theme")}`)
    lightTheme()
    return
  }

  if (!theme) {
    theme = true
    buttonChangeTheme.textContent = "light mode"
    localStorage.setItem("theme", theme)
    console.log(`false : ${localStorage.getItem("theme")}`)
    darkTheme()
    return
  }
})

buttonClearStorage.addEventListener("click", () => {
  localStorage.setItem("search" , "[]")
})


let inputValue
let user = null
let controlStorage = JSON.parse(localStorage.getItem("search"))



/*--------------lastUserLogic-----------------*/

let storageLastUser = controlStorage === null ? [] : JSON.parse(localStorage.getItem("search"))

if (storageLastUser.length !== 0) {
  storageLastUser.forEach(login => {

    let li = document.createElement("li")

    li.classList.add("button")

    li.addEventListener("click", () => {
      getUser(login)
    })

    li.textContent = login

    lastSearchList.append(li)
  })
}

/*--------------lastUserLogic-----------------*/






/*--------------buttonSearchLogic-----------------*/

buttonSearh.addEventListener("click", () => {

  if (inputSearch.value === "") {
    inputSearch.style.border = "1px solid red"
    inputSearch.setAttribute("placeholder", "Fill in this field")
    return
  }

  inputSearch.style.border = "inherit"
  inputSearch.setAttribute("placeholder", "*username")
  inputValue = inputSearch.value
  inputSearch.value = ""

  getUser(inputValue)

})

/*----------------buttonSearchLogic---------------*/




/*----------------changeThemeLogic---------------*/

let theme = JSON.parse(localStorage.getItem("theme"))

theme === null && lightTheme()
theme === false && lightTheme()
theme === true && darkTheme()

theme === null ? buttonChangeTheme.textContent = "dark mode" : buttonChangeTheme.textContent = "ligth mode"
theme === true ? buttonChangeTheme.textContent = "light mode" : buttonChangeTheme.textContent = "dark mode"

/*----------------changeThemeLogic---------------*/


function createCard(user) {

  let date = user.created_at;
  let compilletDate = new Date(date).toLocaleDateString("ru-RU");


  let img = document.createElement("img")
  let login = document.createElement("h2")
  let name = document.createElement("h2")
  let followers = document.createElement("h2")
  let following = document.createElement("h2")
  let create = document.createElement("h2")
  let bio = document.createElement("p")
  let reposetories = document.createElement("h2")
  let button = document.createElement("a")
  


  img.src = user.avatar_url
  login.textContent = `login: ${user.login}`
  login.classList.add("text")
  name.textContent = user.name !== null ? `name: ${user.name}` : "name: not found"
  name.classList.add("text")
  bio.textContent = user.bio !== null ? `bio: ${user.bio}` : "bio: not found"
  bio.classList.add("text")
  followers.textContent = `followers: ${user.followers}`
  followers.classList.add("text")
  following.textContent = `following: ${user.following}`
  following.classList.add("text")
  reposetories.textContent = `repositoried: ${user.public_repos}`
  reposetories.classList.add("text")
  create.textContent = `create date: ${compilletDate}`
  create.classList.add("text")
  button.href = user.html_url
  button.textContent = "Open profile in GH"
  button.classList.add("button")

  userCard.append(img)
  userCard.append(login)
  userCard.append(name)
  userCard.append(bio)
  userCard.append(followers)
  userCard.append(following)
  userCard.append(create)
  userCard.append(reposetories)
  userCard.append(button)

  if(theme){
    darkTheme()
  }
  if(!theme){
    lightTheme()
  }
}

async function getUser(user) {

  userCard.innerHTML = ""

  loading.classList.remove("hidden")

  const response = await fetch(`https://api.github.com/users/${user}`)

  const data = await response.json()

  try {

    user = data

    if (user.status === "404") {
      throw new Error("Что-то пошло не так")
    }

    console.log(user)

    result.style.color = "green"
    result.textContent = " ✅ User found"
    createCard(user)

    if (storageLastUser.length === 0) {
      storageLastUser.push(user.login)
      localStorage.setItem("search", JSON.stringify(storageLastUser))
      return
    }

    let controlledAppend = storageLastUser.filter(item => item === user.login)

    if (controlledAppend.length === 0) {
      controlLength(user.login)
      localStorage.setItem("search", JSON.stringify(storageLastUser))
    }

  }

  catch (error) {
    result.style.color = "red"
    result.textContent = " ❌ User not found :( "
    console.log(error)
  }

  finally {
    loading.classList.add("hidden")
  }

}

function controlLength(item) {
  if (storageLastUser.length >= 5) {
    storageLastUser.shift()
    storageLastUser.push(item)
    return
  }
  storageLastUser.push(item)
  localStorage.setItem("search", JSON.stringify(storageLastUser))
}


function lightTheme() {
  body.style = "background-color: #f8f3f3"

  let button = document.querySelectorAll(".button")

  button.forEach(item => {
    item.classList.remove("buttonDark")
    item.classList.add("buttonLight")
  })

  let title = document.querySelectorAll(".title")

  title.forEach(item => {
    item.classList.remove("titleDark")
    item.classList.add("titleLight")
  })

  let text = document.querySelectorAll(".text")

  text.forEach(item => {
    item.classList.remove("textDark")
    item.classList.add("textLight")
  })

}

function darkTheme() {
  body.style = "background-color: #000"

  let button = document.querySelectorAll(".button")

  button.forEach(item => {
    item.classList.remove("buttonLight")
    item.classList.add("buttonDark")
  })

  let title = document.querySelectorAll(".title")

  title.forEach(item => {
    item.classList.remove("titleLight")
    item.classList.add("titleDark")
  })

  let text = document.querySelectorAll(".text")

  text.forEach(item => {
    item.classList.remove("textLight")
    item.classList.add("textDark")
  })

}