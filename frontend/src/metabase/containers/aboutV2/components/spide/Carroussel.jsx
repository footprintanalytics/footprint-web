/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import Carousel from "react-spring-3d-carousel";
import React, { useState, useEffect } from "react";
import { config } from "react-spring";

export default function Carroussel(props) {
  const table = props.cards.map((element, index) => {
    return { ...element, onClick: () => setGoToSlide(index) };
  });

  const [offsetRadius, setOffsetRadius] = useState(2);
  const [showArrows, setShowArrows] = useState(false);
  const [goToSlide, setGoToSlide] = useState(0);
  const [cards, setCards] = useState(table);
  console.log("goToSlide", goToSlide)
  useEffect(() => {
    setOffsetRadius(props.offset);
    setShowArrows(props.showArrows);
  }, [props.offset, props.showArrows]);

  useEffect(() => {
    props.onChangeSlide(goToSlide)
  }, [goToSlide]);
  useEffect(() => {
    const table = props.cards.map((element, index) => {
      return { ...element, onClick: () => setGoToSlide(index) };
    });
    setCards(table);
  }, [props.cards]);

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <div
      style={{ width: props.width, height: props.height, margin: props.margin, zIndex: 1 }}
    >
      <Carousel
        slides={cards}
        goToSlide={goToSlide}
        offsetRadius={offsetRadius}
        showNavigation={showArrows}
        animationConfig={config.gentle}
      />
      <div className="flex justify-center align-center">
        {cards.map((slide, index) => (
          <span
            key={slide.id}
            style={{
              display: 'inline-block',
              width: goToSlide === index ? '10px': '8px',
              height: goToSlide === index ? '10px': '8px',
              margin: '7px 5px',
              borderRadius: '50%',
              backgroundColor: goToSlide === index ? '#FFF' : '#ffffff40',
              cursor: 'pointer',
            }}
            onClick={() => {
              console.log("index", index)
              setGoToSlide(index)
            }}
          />
        ))}
      </div>
    </div>
  );
}
