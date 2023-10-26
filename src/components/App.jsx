import { useState, useEffect } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import avatar from '../images/potter.jpg';
import api from './../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithImage from './PopupWithImage';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import HandleEscClose from './HandleEscClose';
import HandleOverlayClose from './HandleOverlayClose';


function App() {

  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setisEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setisImagePopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '...', about: '...', avatar: avatar});
  const [cards, setCards] = useState([]);

  
  useEffect(() => {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch(err => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        setCards(cards => cards.map(c => (c._id === card._id ? newCard : c)));
    })
    .catch(err => console.error(err));
  };

  function handleCardDelete(event) {
    event.preventDefault();

    api.deleteCard(selectedCard._id).then(res => {
        setCards(cards => cards.filter(c => c._id !== selectedCard._id))
        setIsDeleteConfirmPopupOpen(false);
      })
      .catch(err => console.error(err));
  };

  function handleCardDeleteClick(card) {
    setSelectedCard(card);
    setIsDeleteConfirmPopupOpen(true);
  };
  
  function handleUpdateUser(userData) {
    api.setUserInfo(userData)
      .then(newUserData => setCurrentUser(newUserData))
      .then(() => closeAllPopups())
      .catch(err => console.error(err));
  };

  function handleUpdateAvatar(newAvatar) {
    api.changeUserAvatar(newAvatar)
      .then(newUserData => setCurrentUser(newUserData))
      .then(() => closeAllPopups())
      .catch(err => console.error(err));
  };

  function handleAddPlace(card) {
    api.setNewCard(card)
      .then(newCard => setCards([newCard, ...cards]))
      .then(() => closeAllPopups())
      .catch(err => console.error(err));
  };

  function handleEditAvatarClick() {
    setisEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setisEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setisAddPlacePopupOpen(true);
  };

  function handleCardClick(cardData) {
    setisImagePopupOpen(true);
    setSelectedCard(cardData);
  };

  function closeAllPopups() {
    setisEditProfilePopupOpen(false);
    setisAddPlacePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setisImagePopupOpen(false);
    setIsDeleteConfirmPopupOpen(false);
  };

  HandleOverlayClose(closeAllPopups);
  HandleEscClose(closeAllPopups);


  return (
    <CurrentUserContext.Provider value={currentUser}>

      <Header/>
      <Main
        cards={cards}
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDeleteClick}/>
      <Footer/>

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/> 

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/>

      <DeleteConfirmPopup isOpen={isDeleteConfirmPopupOpen} onClose={closeAllPopups} onConfirm={handleCardDelete}/>

      <PopupWithImage isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard}/>

    </CurrentUserContext.Provider>
  )
};

export default App;
