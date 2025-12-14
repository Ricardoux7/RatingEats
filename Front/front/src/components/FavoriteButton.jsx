/**
 * Switch (FavoriteButton) Component
 *
 * Botón de alternancia para marcar o desmarcar un restaurante como favorito.
 * Cambia el estado visual y ejecuta un callback al cambiar.
 *
 * Props:
 * @param {string|number} id - ID único del restaurante.
 * @param {boolean} isFav - Indica si el restaurante es favorito.
 * @param {Function} onChange - Callback al cambiar el estado del favorito.
 *
 * Características:
 * - Cambia el estado visual del botón y ejecuta el callback.
 * - Muestra animación de corazón y texto según el estado.
 *
 * Ejemplo de uso:
 * <Switch id={id} isFav={isFavorite} onChange={handleToggle} />
 *
 * @module FavoriteButton
 */
import React from 'react';
import styled from 'styled-components';

const Switch = ({ id, isFav, onChange }) => {
  return (
    <StyledWrapper>
      <div className=''>
        <input type="checkbox" checked={isFav} id={id} name={`favorite-checkbox-${id}`} defaultValue="favorite-button" onChange={onChange} />
        <label htmlFor={`${id}`} className="container">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <div className="action">
            <span className="option-1 hidden md:block">Add to Favorites</span>
            <span className="option-2 hidden md:block">Added to Favorites</span>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  label {
   background-color: white;
   display: flex;
   align-items: center;
   gap: 7px;
   padding: 10px 10px 10px 10px;
   cursor: pointer;
   user-select: none;
   border-radius: 10px;
   box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
   color: black;
  }

  input {
   display: none;
  }

  input:checked + label svg {
   fill: hsl(0deg 100% 50%);
   stroke: hsl(0deg 100% 50%);
   animation: heartButton 1s;
  }

  @keyframes heartButton {
   0% {
    transform: scale(1);
   }

   25% {
    transform: scale(1.3);
   }

   50% {
    transform: scale(1);
   }

   75% {
    transform: scale(1.3);
   }

   100% {
    transform: scale(1);
   }
  }

  input + label .action {
   position: relative;
   overflow: hidden;
   display: grid;
  }

  input + label .action span {
   grid-column-start: 1;
   grid-column-end: 1;
   grid-row-start: 1;
   grid-row-end: 1;
   transition: all .5s;
  }

  input + label .action span.option-1 {
   transform: translate(0px,0%);
   opacity: 1;
  }

  input:checked + label .action span.option-1 {
   transform: translate(0px,-100%);
   opacity: 0;
  }

  input + label .action span.option-2 {
   transform: translate(0px,100%);
   opacity: 0;
  }

  input:checked + label .action span.option-2 {
   transform: translate(0px,0%);
   opacity: 1;
  }
   
    label { ... }

  @media screen and (max-width: 768px) {
    label {
      padding: 5px 0px 5px 0px;
    }
    gap: 0px;
  }
`;  

export default Switch;
