const IMG_URL = `https://image.tmdb.org/t/p/w185_and_h278_bestv2`;
const API_KEY = '461f07f948f247476f8f2780a79126e7';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList  = document.querySelector('.tv-shows__list');
const modal  = document.querySelector('.modal');
const img = document.querySelector('.tv-card__img');

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
}

const renderCard = response => {
    tvShowList.textContent = '';

    response.results.forEach(item => {
        console.log('item', item)

        const {backdrop_path: backdrop,
               name: title, 
               poster_path: poster, 
               vote_average: vote} = item;

        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropImg = backdrop ? IMG_URL + backdrop : img.dataset.backdrop = '';
        const voteElem = '';

        const newCard = document.createElement('li');
            newCard.classList.add('tv-shows__item')
            newCard.innerHTML = `<a href="#" class="tv-card">
                            <span class="tv-card__vote">${vote}</span>
                            <img class="tv-card__img"
                                src="${posterImg}"
                                data-backdrop="${backdropImg}" alt="${title}">
                            <h4 class="tv-card__head">${title}</h4>
                        </a>`
            tvShowList.append(newCard);
            console.log('newCard', newCard)
        
    });

}

new DBServise().getTestData().then(renderCard);

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
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
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

