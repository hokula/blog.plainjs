var logoutBlock = document.querySelector('.logout-block');
var addForm = document.querySelector('.add-blog-form');
var signIn = document.querySelector('.sign-in');
var users = [];
var allBlogs = [];
var loggedUser = {};

function hide(el) {
    el.style.display = 'none';
}
function clearValue(id) {
    document.getElementById(id).value = '';
}

function isUserLogged() {
    var userData = localStorage.getItem('loggedUser');
    if (userData) {
        var user = JSON.parse(userData);
        login(user.email, user.password);
    } else {
        hide(logoutBlock);
        hide(addForm);
        displayBlog();
    }
}
isUserLogged();

function isGuest() {
    return !loggedUser.name;
}

function login(p_email, p_password) {
    var email = p_email || document.getElementById('email').value;
    var password = p_password || document.getElementById('password').value;
    var usersData = localStorage.getItem('users');
    if (usersData) {
        users = JSON.parse(usersData);
    }
    for (var user of users) {
        if ((email === user.email || email === user.username) && password === user.password) {
            var loginForm = document.getElementById('login-form');
            loginForm.style.display = 'none';
            hide(signIn);
            var divnav = document.querySelector('.wrapper');
            divnav.style.display = 'block';
            var name = document.getElementById('user-name');
            name.innerHTML = user.name;
            addForm.style.display = 'block';
            logoutBlock.style.display = 'flex';
            loggedUser = user;
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            clearValue('email');
            clearValue('password');
        } else {
            var errormsg = document.querySelector('#login-form .error-msg');
            errormsg.style.display = 'block';
        }
    }
    displayBlog();
}
function enter(event) {
    if (event.keyCode === 13) {
        login();
    }
}
function logout() {
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
    var divnav = document.querySelector('.wrapper');
    divnav.style.display = 'none';
    document.querySelector('#login-form .error-msg').style = "display:none";
    localStorage.removeItem('loggedUser');
    loggedUser = {};
}
function toRegister() {
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'none';
    var registerForm = document.getElementById('register-form');
    registerForm.style.display = 'block';
}
function toLogIn() {
    var registerForm = document.getElementById('register-form');
    registerForm.style.display = 'none';
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
}
function registerNow() {
    var fullName = document.getElementById('name').value;
    var userEmail = document.getElementById('su-email').value;
    var userAddress = document.getElementById('address').value;
    var userName = document.getElementById('username').value;
    var userPassword = document.getElementById('su-password').value;

    if (fullName === '' || userEmail === '' || userAddress === '' || userName === '' || userPassword === '') {
        return alert('Unesite sve podatke');
    } else {
        var user = {
            email: userEmail,
            password: userPassword,
            username: userName,
            name: fullName,
            address: userAddress
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        clearValue('name');
        clearValue('su-email');
        clearValue('address');
        clearValue('username');
        clearValue('su-password');

        toLogIn();
    }
}
function registerNow() {
    var fullName = document.getElementById('name').value;
    var userEmail = document.getElementById('su-email').value;
    var userAddress = document.getElementById('address').value;
    var userName = document.getElementById('username').value;
    var userPassword = document.getElementById('su-password').value;

    if (fullName === '' || userEmail === '' || userAddress === '' || userName === '' || userPassword === '') {
        return alert('Unesite sve podatke');
    } else {
        var user = {
            email: userEmail,
            password: userPassword,
            username: userName,
            name: fullName,
            address: userAddress
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        clearValue('name');
        clearValue('su-email');
        clearValue('address');
        clearValue('username');
        clearValue('su-password');

        toLogIn();
    }
}

function postBlog() {
    var blogTitle = document.getElementById('blog-title').value;
    var blogDesc = document.getElementById('blog-desc').value;
    if (blogTitle === '' || blogDesc === '') {
        return alert('Popunite sve podatke');
    }
    var blog = {
        blogTitle,
        blogDesc,
        postDate: new Date(),
        author: loggedUser.name,
        comments: [],
        likes: [],
        dislikes: []
    };

    allBlogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    displayBlog();


    clearValue('blog-title');
    clearValue('blog-desc');
}

function displayBlog() {
    var blogsData = localStorage.getItem('blogs');
    if (blogsData) {
        allBlogs = JSON.parse(blogsData);
    }
    renderBlogs(allBlogs);
}
function searchBlogs(event) {
    var searchBy = event.target.value;
    var filteredBlogs = [];
    for (var blog of allBlogs) {
        if (blog.blogTitle.toLowerCase().indexOf(searchBy.toLowerCase()) > -1) {
            filteredBlogs.push(blog);
        }
    }
    renderBlogs(filteredBlogs);
}

function renderBlogs(blogs) {
    blogs.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    var publishedBlogs = document.getElementById('published-blogs');
    publishedBlogs.innerHTML = '';
    for (var blog of blogs) {
        var div = document.createElement('div');
        div.classList.add('posted-blog');
        div.style = "margin-bottom: 3px; width: 97%";
        var h4 = document.createElement('h4');
        h4.innerHTML = blog.blogTitle;
        h4.style = "display: flex; justify-content: space-between; align-items: flex-start;";
        h4.appendChild(createDeleteBtn(blog));
        var p = document.createElement('p');
        p.innerHTML = blog.blogDesc;
        var span = document.createElement('span');
        span.innerHTML = `Author: <span style="font-weight:bold;">${blog.author}</span> &nbsp; `;
        var datum = document.createElement('i');
        datum.innerHTML = new Date(blog.postDate).toLocaleString();

        div.appendChild(h4);
        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        div.appendChild(addLike(blog));

        publishedBlogs.appendChild(div);
        showComments(blog.comments, publishedBlogs);
        publishedBlogs.appendChild(addComment(blog));

    }
}

function addComment(blog) {
    var input = document.createElement('input');
    input.classList.add('blog-input');
    input.placeholder = 'Leave a comment....';
    input.style = 'width: 50%; margin-left: 45%;';
    input.addEventListener('keyup', function (e) {
        var text = e.target.value;
        if (e.key !== "Enter") return;
        if (isGuest()) return alert('Molimo Vas registrujte se');
        var comment = {
            text,
            author: loggedUser.name,
            postedDate: new Date()
        };
        if (!blog.comments) {
            blog.comments = [];
        }
        blog.comments.push(comment);
        localStorage.setItem('blogs', JSON.stringify(allBlogs));
        input.value = '';
        renderBlogs(allBlogs);
    });
    return input;
}
function showComments(comments, parentEl) {
    for (var comment of comments) {
        var div = document.createElement('div');
        div.classList.add('posted-blog');
        div.style = "margin-bottom: 3px; width: 57%; margin-left:40%; padding: 7px;";
        var p = document.createElement('p');
        p.innerHTML = comment.text;
        var span = document.createElement('span');
        span.innerHTML = `Author: ${comment.author} &nbsp; `;
        var datum = document.createElement('i');
        datum.innerHTML = new Date(comment.postedDate).toLocaleString();

        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        parentEl.appendChild(div);
    }
}
function createDeleteBtn(blog) {
    var btn = document.createElement('button');
    btn.classList.add('blog-delete-btn');
    btn.innerHTML = '<i class="fa fa-trash" style="font-size:26px; cursor:pointer;"></i>';
    btn.style.display = loggedUser.name === blog.author ? 'block' : 'none';
    btn.addEventListener('click', function () {
        var index = allBlogs.indexOf(blog);
        var response = confirm('Are you sure?');
        if (!response) return;
        allBlogs.splice(index, 1);
        localStorage.setItem('blogs', JSON.stringify(allBlogs));
        renderBlogs(allBlogs);
    })
    return btn;
}

function addLike(blog) {
    var id = allBlogs.indexOf(blog);
    var licon = isUserLiked(blog) ? 'up': 'o-up';
    var dicon = isUserDisliked(blog) ? 'down': 'o-down';
    var likeWrapper = document.createElement('div');
    likeWrapper.classList.add('like-icons');
    likeWrapper.innerHTML = `
    <i data-id="${id}" style="color:blue;" onclick="likeBlog(event)" class="fa fa-thumbs-${licon}"></i>
    <span title="${blog.likes ? blog.likes.toString() : "Nema lajkova"}" style="color:blue;">${blog.likes ? blog.likes.length : 0}</span>
    <i data-id="${id}" style="color:red;" onclick="dislikeBlog(event)" class="fa fa-thumbs-${dicon}"></i>
    <span title="${blog.dislikes ? blog.dislikes.toString() : "Nema dislajkova"}" style="color:red;">${blog.dislikes ? blog.dislikes.length : 0}</span>
    `;
    return likeWrapper;
}
function likeBlog(e) {
    var index = e.target.getAttribute('data-id');
    var blog = allBlogs[index];
    if (!blog.likes) {
        blog.likes = [];
    }
    if(blog.likes.includes(loggedUser.username)) {
        var i = blog.likes.indexOf(loggedUser.username);
        blog.likes.splice(i, 1);
    } else { 
    blog.likes.push(loggedUser.username);
    }
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    renderBlogs(allBlogs);
}
function dislikeBlog(e) {
    var index = e.target.getAttribute('data-id');
    var blog = allBlogs[index];
    if (!blog.dislikes) {
        blog.dislikes = [];
    }
    if(blog.dislikes.includes(loggedUser.username)) {
        var i = blog.dislikes.indexOf(loggedUser.username);
        blog.dislikes.splice(i, 1);
    } else { 
    blog.dislikes.push(loggedUser.username);
    }
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    renderBlogs(allBlogs);
}

function isUserLiked(blog) {
    if (!blog.likes) return;
    if (blog.likes.includes(loggedUser.username)) {
        return true;
    } else return;
}
function isUserDisliked(blog) {
    if (!blog.dislikes) return;
    if (blog.dislikes.includes(loggedUser.username)) {
        return true;
    } else return;
}