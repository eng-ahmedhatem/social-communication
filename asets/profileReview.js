let btn_module = "E"
let user__id
function pagLode(lode) {
    if (lode) {
        $("#loading").show("fast")
        $("nav").removeClass("sticky-top")
    } else {
        $("#loading").hide("fast")
        $("nav").addClass("sticky-top")
    }
}
handelBtn_creatPost_And_edite()
function handelBtn_creatPost_And_edite(E_title, E_body, E_img) {
    if (btn_module === "N") {
        console.log(1);
    } else {
        $("#content_newPost").html(`
        <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between">
          <h5 class="modal-title text-uppercase" id="exampleModalLabel">Edit Post</h5>
          <button type="button" id="modal_close"
            class="close d-flex justify-content-center align-items-center border-0 fs-4 w-auto h-auto"
            data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body ">

          <div data-mdb-input-init class="form-outline flex-fill mb-2 ">
            <label class="form-label" for="post_title">Post Title</label>
            <input type="text" id="post_title" class="form-control" value = "${E_title}" />
          </div>
          <div class="mb-3">
            <label for="post_pody" class="form-label">Post Body</label>
            <textarea class="form-control" id="post_pody" rows="3">${E_body}</textarea>
          </div>
          <div class="mb-4">
            <label class="mb-1" for="post-user-img">Choose a picture for your new post</label>
            <input type="file" class="form-control  " id="post-user-img">
          </div>
          <button id="go_newpost" class="btn btn-primary w-100" onclick="go_edit_post()" >Edit</button>


        </div>

      </div>
    </div>
    
    `);
    }
}

function pagLode(lode) {
    if (lode) {
        $("#loading").show("fast")
        $("nav").removeClass("sticky-top")
    } else {
        $("#loading").hide("fast")
        $("nav").addClass("sticky-top")
    }
}
function ui_login() {
    if (localStorage.getItem("token")) {
        $("#login_register").hide();
        $("#signOut").show();
        let user_loginData = JSON.parse(localStorage.getItem("token"))
        // **** nav logo 
        $("#user__img").show();
        $("#user__name").show();
        $("#user__name").html(user_loginData.user.name)

        if (user_loginData.user.profile_image.length > 1) {
            document.querySelector("#user__img").src = user_loginData.user.profile_image
        } else {
            document.querySelector("#user__img").src = "./asets/user vector.jpg"
        }
    } else {
        $("#login_register").show();
        $("#signOut").hide();
        $("#user__img").hide();
        $("#user__name").hide();
        $(".add_newPost").remove()
    }
    setTimeout(_ => {
        pagLode(false)
    }, 500)
}
let [userName, userPassword, remember, show_form_log] = [document.querySelector('#user_name'), document.querySelector('#user_Password'), document.querySelector('#checkbox'), document.querySelector('#show_form_log')]
show_form_log.addEventListener("click", _ => {
    if (localStorage.getItem("remember")) {
        let loginFeild_data = JSON.parse(localStorage.getItem("remember"))
        userName.value = loginFeild_data.user_n
        userPassword.value = loginFeild_data.user_p
    }
})
async function login(url, e) {
    pagLode(true)
    if (userName.value.length == 0 && userPassword.value.length == 0) {
        e.preventDefault()
    } else {
        if (remember.checked) {
            localStorage.setItem("remember", JSON.stringify({
                user_n: userName.value,
                user_p: userPassword.value
            }))
        } else {
            localStorage.removeItem("remember")
        }
        let rq = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                username: userName.value,
                password: userPassword.value
            }),
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                pagLode(false)
                if (data.errors) {
                    console.log(data);
                    alert(data.message, 'danger')
                } else {
                    localStorage.setItem("token", JSON.stringify(data))
                    ui_login()
                    alert('You have successfully logged in.', 'success')
                    $("#content_login").hide("fast");
                    $(".modal-backdrop").hide()

                }
            }).catch(error => {
                pagLode(false)
                console.log(error)
            })


    }

}
document.querySelector('#login').addEventListener("click", e => {
    login("https://tarmeezacademy.com/api/v1/login", e)
})


function alert(message, type) {
    const alertPlaceholder = document.querySelector('#alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
        setTimeout(_ => {
            alertPlaceholder.innerHTML = ""
        }, 5000)
    }


    appendAlert(message, type)
}
$("#signOut_btn").click(_ => {
    pagLode(true)
    localStorage.removeItem("token")
    ui_login()
    alert("You have been successfully logged out.", "info")

})
ui_login()
let [re_user_password, re_user_name, re_user_userName, re_user_img, re_user_email] = [document.querySelector('#re-user-password'), document.querySelector('#re-user-name'), document.querySelector('#re-user-userName'), document.querySelector('#re-user-img'), document.querySelector('#re-user-email')]
async function register() {
    let url = "https://tarmeezacademy.com/api/v1/register"
    let formData = new FormData()
    formData.append("username", re_user_userName.value)
    formData.append("password", re_user_password.value)
    if (re_user_img.files.length > 0) {
        formData.append("image", re_user_img.files[0]);
    }
    formData.append("name", re_user_name.value)
    formData.append("email", re_user_email.value)

    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            localStorage.setItem("token", JSON.stringify(response.data))
            alert('You have successfully logged in.', 'success')
            $("#content_register").hide("fast");
            $(".modal-backdrop").hide()
            ui_login()
        })
        .catch(error => {
            console.log(error);
            alert(error.response.data.message, 'danger')
        })

}

document.querySelector('#goRegister').addEventListener("click", _ => {
    register()
})
pagLode(false)


let userId = new URLSearchParams(location.search)
if (userId.has("userId")) {
    user__id = userId.get("userId")
    axios.get("https://tarmeezacademy.com/api/v1/users/" + user__id).then(data => {
        console.log(data.data.data);
        $(".user_info").html(`

        <div class="col-12 col-md-6 d-flex  align-items-center  ">
        <div class="img p-3 me-4 overflow-hidden border rounded-circle border-danger border-opacity-75">
          <img src="${data.data.data.profile_image}" class="rounded-circle" width="150px" height="150px" alt="">
        </div>
        <div class="text " >
          <h5 class="fw-bold mb-1" id="user_email">${data.data.data.email}</h5>
          <p class="fw-bold fs-5 mb-1" id="user_name">${data.data.data.name}</p>
          <p class="fw-bold fs-5 mb-1" id="user_userName">${data.data.data.username}</p>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <p class="fs-4"><span class="fw-light " style="font-size: 70px; ">${data.data.data.comments_count}</span><span style="color: #777;">comment</span></p>
        <p class="fs-4"><span class="fw-light " style="font-size: 70px; ">${data.data.data.posts_count}</span><span style="color: #777;">post</span></p>
      </div>
            
            `)
            $("#user_namePosts").html(data.data.data.name)
        getCurrent_userPost(user__id)
    })

} else if (localStorage.getItem("token")) {
    let data_user = JSON.parse(localStorage.getItem("token"))
    console.log(data_user);
    getCurrent_userPost(data_user.user.id)
    user__id = data_user.user.id
    $("#user_namePosts").html(data_user.user.name)
    $(".user_info").html(`
        
        <div class="col-12 col-md-6 d-flex  align-items-center  ">
        <div class="img p-3 me-4 overflow-hidden border rounded-circle border-danger border-opacity-75">
          <img src="${data_user.user.profile_image}" class="rounded-circle" width="150px" height="150px" alt="">
        </div>
        <div class="text " >
          <h5 class="fw-bold mb-1" id="user_email">${data_user.user.email}</h5>
          <p class="fw-bold fs-5 mb-1" id="user_name">${data_user.user.name}</p>
          <p class="fw-bold fs-5 mb-1" id="user_userName">${data_user.user.username}</p>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <p class="fs-4"><span class="fw-light " style="font-size: 70px; ">${data_user.user.comments_count}</span><span style="color: #777;">comment</span></p>
        <p class="fs-4"><span class="fw-light " style="font-size: 70px; ">${data_user.user.posts_count}</span><span style="color: #777;">post</span></p>
      </div>
        
        `)

} else {
    location.replace("index.html")
}
async function getCurrent_userPost(user_id) {
    function get_all_posts(url, oneTurn = false) {
        if (oneTurn) {
            document.querySelector('.posts').innerHTML = "";
        }
        setTimeout(() => {
            async function get() {
                let req = await fetch(url)
                let data = await req.json()

                if (req.ok) {
                    for (let ele in Array.from(data.data)) {
                        let check_post
                        if (localStorage.getItem("token")) {
                            let user_loginData = JSON.parse(localStorage.getItem("token"))
                            check_post = data.data[ele].author.id == user_loginData.user.id ? `<button class=" btn_edit btn btn-secondary me-4" data-post="${data.data[ele].title},${data.data[ele].body},${""},${data.data[ele].id}" onclick="edit_post(this)">Edit</button><button class=" btn btn-danger me-4" data-post="${data.data[ele].id}" onclick="delete_post(this)" data-toggle="modal" data-target="#confirm_delete">Delete</button>` : ""
                        }
                        document.querySelector('.posts').innerHTML +=
                            `
        <div  class="post card card_body bg-body-tertiary mb-3 h-75"   >
                    <div id="card_hdr" data-card_id="${data.data[ele].id}" class="d-flex p-2 align-items-center justify-content-between  " >
                    <div class="d-flex align-items-center" data-id="${data.data[ele].author.id}" onclick="profile_preview(this)" >
                    <img src="${data.data[ele].author.profile_image}" width="60px"  alt="" class="rounded-circle d-inline-block m-3 border border-black border-opacity-20" >
                    <h2 class="fs-6 text-capitalize fw-bold">@${data.data[ele].author.name}</h2>
                    </div>
                    <div class="d-flex flex-row-reverse">
                    ${localStorage.getItem("token") ? check_post : ""}
                    </div>
                    </div>
                    <div id="${data.data[ele].id}" onclick = "postReview(${data.data[ele].id})" >
                    <div class="p-3 body__img">
                    <img class="" src="${data.data[ele].image}" height=" 300px"  class="card-img-top object-fit-cover" alt="...">
                    <div class="card-body" style="cursor: pointer;">
                    <p class="card-text"><small class="text-body-secondary">${data.data[ele].created_at}</small></p>
                    <h2>${data.data[ele].title}</h2>
                    <p class="card-text">${data.data[ele].body}</p>
                    </div>
                    <hr>
                    <div>
                    <i class="fa-solid fa-pen fa-fade"></i>
                    <span>(${data.data[ele].comments_count}) comment</span>
                    <span id="tags-${data.data[ele].id}"></span>
                    </div>
                    </div>
                    </div>
                  </div>
        `

                        document.querySelector(`#tags-${data.data[ele].id}`).innerHTML = ""
                        for (tag of data.data[ele].tags) {
                            document.querySelector(`#tags-${data.data[ele].id}`).innerHTML += `
            <span class="btn btn-sm rounded-5 bg-secondary">${tag.name}</span>
            `
                        }
                    }

                }
                pagLode(false)
            }
            get()
        }, 0);

    }
    get_all_posts(`https://tarmeezacademy.com/api/v1/users/${user_id}/posts`, true)
}
async function new_post(post_edit_id) {
    let userData_fromLocal = JSON.parse(localStorage.getItem("token"))
    let postBody = $("#post_pody").val()
    let postTitle = $("#post_title").val()
    let postImg = document.querySelector('#post-user-img').files
    let url = "https://tarmeezacademy.com/api/v1/posts"
    if (btn_module === "N") {
        console.log(5);
    } else {
        url += `/${post_edit_id}`
        let formData = new FormData();
        formData.append("title", postTitle)
        if (postImg.length > 0) {
            formData.append("image", postImg[0])
        }
        formData.append("body", postBody)
        formData.append("_method", "put")
        axios.post(url, formData, {
            headers: {
                "Authorization": `Bearer ${userData_fromLocal.token}`,
                "Content-Type": 'multipart/form-data'
            }
        }).then(response => {
            alert('You have successfully edit the post', 'success')
            $("#content_newPost").hide("fast");
            $(".modal-backdrop").hide()
        })
            .catch(error => {
                console.log(error);
                alert(error.response.data.message, 'danger')
            })
    }

}





const myModal = new bootstrap.Modal('#content_newPost');
const modal = bootstrap.Modal.getInstance('#content_newPost');
function edit_post(btn) {
    btn_module = "E"
    let post_data = btn.dataset.post.split(",")
    let post_title = post_data[0]
    let postbody = post_data[1]
    let post_img = post_data[2]
    let post_id = post_data[3]
    localStorage.setItem("post_edit_id", post_id)
    handelBtn_creatPost_And_edite(post_title, postbody, post_img)
    modal.show();
    $("#modal_close").click(_ => {
        modal.hide()
    })
}






function go_edit_post() {
    pagLode(true)
    new Promise((res, rej) => {
        setTimeout(() => {
            new_post(localStorage.getItem("post_edit_id"))
            res()
        }, 0);
    }).then(_ => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                getCurrent_userPost(user__id)
                modal.hide()
                res()
            }, 1500);
        })
    }).finally(_ => {
        pagLode(false)
    })
}


function delete_post(element) {
    let btn_delete = document.querySelector('#btn_delete');
    btn_delete.addEventListener('click', () => {
        let url = `https://tarmeezacademy.com/api/v1/posts/${element.dataset.post}`

        let userData_fromLocal = JSON.parse(localStorage.getItem("token"))

        axios.delete(url, {
            headers: {
                "Authorization": `Bearer ${userData_fromLocal.token}`,
                "Content-Type": 'multipart/form-data'
            }
        }).then(response => {
            alert('You have successfully delete the post', 'success')
            $("#confirm_delete").hide("fast");
            $(".modal-backdrop").hide()
            getCurrent_userPost(user__id)
        })
            .catch(error => {
                console.log(error);
                alert(error.response.data.message, 'danger')
            })


    });

}
function postReview(post_id) {
    localStorage.setItem("postDetails", post_id);
    location.assign("postReview.html");
}