class ResponseSender {
    GET = (url, mounterFunc, query = '') => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, [true])
        xhr.send()
        xhr.onload = () => {
            mounterFunc(xhr.response)
        }
        xhr.onerror = () => {
            this.createError(url)
        }
    }
    POST(url, headers, query = '') {
        // Для чего я создан???
    }
    createError = (request_url) => {
        console.log(request_url)
    }
    createElementFromHTML = (htmlString) => {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
    hide = (elem_selector) => {
        document.querySelector(elem_selector).style.display = 'none'
    }
    show = (elem_selector) => {
        document.querySelector(elem_selector).style.display = 'flex'
    }
    addClass = (elem_selector, class_name) => {
        document.querySelector(elem_selector).classList.add(class_name)
    }
    removeClass = (elem_selector, class_name) => {
        document.querySelector(elem_selector).classList.remove(class_name)
    }
}

const $ = new ResponseSender

// Рендерит список людей
const nameListMounter = (json) => {
    let users = JSON.parse(json)
    $.users = []
    $.hide('#main_preloader')
    $.show('#catalog')
    for (const user of users) {
        if (user.hasOwnProperty('name')) {
            $.users.push(user)
            let container = document.querySelector(`.catalog`)
            container.appendChild($.createElementFromHTML(`
            <button class="name" id="user-${user.id}" onclick="openUserByID(${user.id}, this);">
                <div class="plus_btn_container">
                    <div class="plus" data-tapped="0">+</div>
                </div>
                <div class="name_and_secondname">
                    ${user.name}
                </div>
            </button>
            `))
        }
    }
}

const openUserByID = (user_id, button) => {
    let root = `#albums-of-user-${user_id}`
    let btn = button.childNodes[1].childNodes[1]
    if (btn.dataset.tapped == 0) {
        if (document.querySelector(root) == null) {
            $.GET(`https://json.medrating.org/albums?userId=${user_id}`, albumListMounter)
        } else {
            $.show(root)
        }
        btn.dataset.tapped = 1
        btn.innerHTML = '-'
        btn.classList.add('plus_tapped')
    } else {
        $.hide(root)
        btn.dataset.tapped = 0
        btn.innerHTML = '+'
        btn.classList.remove('plus_tapped')
    }
    
}

const albumListMounter = (json) => {
    let albums = JSON.parse(json)
    let pather = document.querySelector(`#user-${albums[0].userId}`)
    let container = $.createElementFromHTML(`
        <div class="album_list" id="albums-of-user-${albums[0].userId}"></div>
    `)
    for (const album of albums) {
        container.appendChild($.createElementFromHTML(`
            <button onclick="openAlbumByID(${album.id}, this);" class="album" id="album-${album.id}">
                <div class="plus_btn_container">
                    <div data-tapped="0" class="plus">+</div>
                </div>
                <div class="name_and_secondname">
                    ${album.title}
                </div>
            </button>
        `))
    }
    pather.after(container)
}

const openAlbumByID = (album_id, button) => {
    let root = `#photos-of-album-${album_id}`
    let btn = button.childNodes[1].childNodes[1]
    if (btn.dataset.tapped == 0) {
        if (document.querySelector(root) == null) {
            $.GET(`https://json.medrating.org/photos?albumId=${album_id}`, galleryMounter)
        } else {
            $.show(root)
        }
        btn.dataset.tapped = 1
        btn.innerHTML = '-'
        btn.classList.add('plus_tapped')
    } else {
        $.hide(root)
        btn.dataset.tapped = 0
        btn.innerHTML = '+'
        btn.classList.remove('plus_tapped')
    }
}

const galleryMounter = (json) => {
    let photos = JSON.parse(json)
    let pather = document.querySelector(`#album-${photos[0].albumId}`)
    let container = $.createElementFromHTML(`
        <div class="gallery_container">
            <div class="gallery" id="photos-of-album-${photos[0].albumId}"></div>
        </div>
    `)
    for (const photo of photos) {
        container.childNodes[1].appendChild($.createElementFromHTML(`
            <div class="photo_preview" id="photo-${photo.id}">
                <button data-tapped="0" onclick="checkImageInFavorite('${photo.thumbnailUrl}', '${photo.url}', '${photo.title}', '${photo.id}', '${photo.albumId}')" class="add_to_favorite"><i></i></button>
                <div>
                    <img onclick="openPhoto('${photo.url}', this);" src="${photo.thumbnailUrl}" alt="${photo.title}">
                </div>
            </div>
        `))
    }
    pather.after(container)
}

const checkPhoto = (element, index, array) => {
    if (element.albumId == albumId) {
        if (element.id == id) {
            return false
        }
    }
    return true
}

const checkImageInFavorite = (thumbnailUrl, url, title, id, albumId) => {
    if ($.photos === undefined) {
        $.photos = []
    } else {

    }
}

const addImageToFavorite = () => {

}

const removeImageFromFavorite = () => {

}

// Переключает вкладки
function changeTab(classList) {
    if (classList.length === 2) {
        if (classList[0] === 'catalog_tab') {
            $.addClass('.favorite_tab', 'inactive_nav_btn')
            $.removeClass('.catalog_tab.inactive_nav_btn', 'inactive_nav_btn')
            $.hide('.favorite')
            $.show('.catalog')
        } else {
            $.addClass('.catalog_tab', 'inactive_nav_btn')
            $.removeClass('.favorite_tab.inactive_nav_btn', 'inactive_nav_btn')
            $.hide('.catalog')
            $.show('.favorite')
        }
    }
}

// Меняет заливку звездочки избранного
function changeStarState() {
    let plus = document.querySelector('.favorite_tab i').style.background
    if (plus === `url('./assets/star_active.svg')`) {
        document.querySelector('.favorite_tab i').style.background = `url('./assets/star.svg')`
    } else {
        document.querySelector('.favorite_tab i').style.background = `url('./assets/star_active.svg')`
    }
}



document.addEventListener("DOMContentLoaded", function (event) {
    $.GET('https://json.medrating.org/users/', nameListMounter)
});