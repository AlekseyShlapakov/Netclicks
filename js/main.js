const IMG_URL = `https://image.tmdb.org/t/p/w185_and_h278_bestv2`;
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '461f07f948f247476f8f2780a79126e7';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList  = document.querySelector('.tv-shows__list');
const modal  = document.querySelector('.modal');
const tvShows  = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal-link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';


const DBServise = class {
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok) {
            return res.json();
        } else {
            throw new Error (`Не удалось получить данные 
                по адресу ${url}`)
        }
    }

    getTestData = async () => {
        return await this.getData('test.json')
    }

    getTestCard = async () => {
        return await this.getData('card.json')
    }

    getSearchResult = (query) => {
        return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`)
    }

    getTvShow = id => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`)
    }
}

console.log('new DBServise().getSearchResult(\'Копы\')', new DBServise().getSearchResult('Копы'))

const renderCard = response => {
    tvShowList.textContent = '';

    response.results.forEach(item => {

        const {backdrop_path: backdrop,
            name: title, 
            poster_path: poster, 
            vote_average: vote,
            id} = item;

        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropImg = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const newCard = document.createElement('li');
        newCard.classList.add('tv-shows__item')
        newCard.innerHTML = `<a id="${id}" href="#" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                            src="${posterImg}"
                            data-backdrop="${backdropImg}" alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>`;
        loading.remove();
        tvShowList.append(newCard);

        
    });

}

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('e', e);
    const value = searchFormInput.value.trim();
    if(value) {
        tvShows.append(loading);
        new DBServise().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';


});


// Открытие и закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
})

leftMenu.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = e.target.closest('.dropdown');
    if( dropdown ) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
})

// Открытие модального окна
tvShowList.addEventListener('click', (e) => {
    e.preventDefault();
    const card = e.target.closest('.tv-card');
    if(card) {

        new DBServise().getTvShow(card.id).then(response => {
            tvCardImg.src = IMG_URL + response.poster_path;
            tvCardImg.alt = response.name;
            modalTitle.textContent = response.name;
            // genresList.innerHTML = response.genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, '');
            genresList.textContent = '';
            // for (const item of response.genres) {
            //     genresList.innerHTML += `<li>${item.name}</li>`;
            // }

            response.genres.forEach(item => {
                genresList.innerHTML += `<li>${item.name}</li>`;
            });
            rating.textContent = response.vote_average;
            description.textContent = response.overview;
            // modalLink.href = response.homepage;

        }).then(() => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        })


    }
})

// Закрытие модального окна
modal.addEventListener('click', (e) => {
    if( e.target.closest('.cross') || 
    e.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
})

// Смена карточки
// const changeImage = (e) => {
//     const card = e.target.closest('.tv-shows__item');
//     if ( card ) {
//         const img = card.querySelector('.tv-card__img');
//         console.log('img', img)
//         const changeImg = img.dataset.backdrop;
//         if ( changeImg ) {
//             img.dataset.backdrop = img.src;
//             img.src = changeImg;
//         }

//     }
// };

// tvShowList.addEventListener('mouseover', changeImage);
// tvShowList.addEventListener('mouseout', changeImage);

// Второй вариант
const changeImage = (e) => {
    const card = e.target.closest('.tv-shows__item');
    if ( card ) {
        const img = card.querySelector('.tv-card__img');

        if ( img.dataset.backdrop ) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }

    }
};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);

