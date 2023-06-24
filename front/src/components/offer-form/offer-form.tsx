import {FormEvent, useCallback, useRef, useState} from 'react';
import Select from 'react-select';

import {City, NewOffer, Offer} from '../../types/types';

import LocationPicker from '../location-picker/location-picker';
import { CITIES, CityLocation, GOODS, TYPES } from '../../const';
import { capitalize } from '../../utils';


export enum FormFieldName {
  title = 'title',
  description = 'description',
  cityName = 'city',
  previewImage = 'previewImage',
  isPremium = 'isPremium',
  type = 'type',
  bedrooms = 'bedrooms',
  maxAdults = 'maxAdults',
  price = 'price',
  good = 'good-',
  image = 'image',
  goods = 'goods',
  images = 'images',
  location = 'location'
}

const getGoods = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): string[] => {
  const chosenGoods: string[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.good)) {
      chosenGoods.push(entry[0].slice(FormFieldName.good.length));
    }
  }
  return chosenGoods;
};

const getCity = (cityName: FormDataEntryValue | null): City => {
  const name = String(cityName);
  if (cityName && CITIES.includes(name)) {
    return {
      name,
      location: CityLocation[name],
    };
  }

  return { name: CITIES[0], location: CityLocation[CITIES[0]] };
};

const getImages = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): File[] => {
  const enteredImages: File[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.image) && entry[1] instanceof File && entry[1].name) {
      enteredImages.push(entry[1]);
    }
  }
  return enteredImages;
};

type OfferFormProps<T> = {
  offer: T;
  onSubmit: (offerData: T, fields?: Set<string>) => void;
  isCreate: boolean;
};

const OfferForm = <T extends Offer | NewOffer>({
  offer,
  onSubmit,
  isCreate
}: OfferFormProps<T>): JSX.Element => {
  const {
    title,
    description,
    city,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods: chosenGoods,
    location,
  } = offer;
  const fields = useRef(new Set<string>());
  fields.current.add('id');
  const [chosenLocation, setChosenLocation] = useState(location);
  const [chosenCity, setChosenCity] = useState(city);

  const handleCityChange = (value: keyof typeof CityLocation) => {
    fields.current.add(FormFieldName.cityName);
    setChosenCity(getCity(value));
    setChosenLocation(CityLocation[value]);
  };

  const handleLocationChange = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      fields.current.add(FormFieldName.location);
      setChosenLocation({ latitude: lat, longitude: lng });
    },
    []
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...offer,
      title: isCreate || fields.current.has(FormFieldName.title) ? formData.get(FormFieldName.title) : null,
      description: isCreate || fields.current.has(FormFieldName.description) ? formData.get(FormFieldName.description) : null,
      city: isCreate || fields.current.has(FormFieldName.cityName) ? getCity(formData.get(FormFieldName.cityName)) : null,
      previewImage: isCreate || fields.current.has(FormFieldName.previewImage) ? formData.get(FormFieldName.previewImage) : null,
      isPremium: isCreate || fields.current.has(FormFieldName.isPremium) ? Boolean(formData.get(FormFieldName.isPremium)) : null,
      type: isCreate || fields.current.has(FormFieldName.type) ? formData.get(FormFieldName.type) : null,
      bedrooms: isCreate || fields.current.has(FormFieldName.bedrooms) ? Number(formData.get(FormFieldName.bedrooms)) : null,
      maxAdults: isCreate || fields.current.has(FormFieldName.maxAdults) ? Number(formData.get(FormFieldName.maxAdults)) : null,
      price: isCreate || fields.current.has(FormFieldName.price) ? Number(formData.get(FormFieldName.price)) : null,
      goods: isCreate || fields.current.has(FormFieldName.goods) ? getGoods(formData.entries()) : null,
      location: isCreate || fields.current.has(FormFieldName.location) ? chosenLocation : null,
      images: isCreate || fields.current.has(FormFieldName.images) ? getImages(formData.entries()) : null,
    };
    console.log(fields.current);
    console.log(data);
    onSubmit(data, fields.current);
  };

  const handleFormChange = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    let name = target.name;
    if (name.startsWith(`${FormFieldName.image}[`)) {
      name = FormFieldName.images;
    }
    if (name.startsWith(FormFieldName.good)) {
      name = FormFieldName.goods;
    }
    fields.current.add(name);
  };

  const handleTypeChange = () => {
    fields.current.add('type');
  };

  return (
    <form
      className="form offer-form"
      action="src/components/offer-form/offer-form#"
      method="post"
      onSubmit={handleFormSubmit}
      onChange={handleFormChange}
    >
      <fieldset className="title-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="title" className="title-fieldset__label">
            Title
          </label>
          <input
            className="form__input title-fieldset__text-input"
            placeholder="Title"
            name={FormFieldName.title}
            id="title"
            required
            defaultValue={title}
          />
        </div>
        <div className="title-fieldset__checkbox-wrapper">
          <input
            className="form__input"
            type="checkbox"
            name={FormFieldName.isPremium}
            id="isPremium"
            defaultChecked={isPremium}
          />
          <label htmlFor="isPremium" className="title-fieldset__checkbox-label">
            Premium
          </label>
        </div>
      </fieldset>
      <div className="form__input-wrapper">
        <label htmlFor="description" className="offer-form__label">
          Description
        </label>
        <textarea
          className="form__input offer-form__textarea"
          placeholder="Description"
          name={FormFieldName.description}
          id="description"
          required
          defaultValue={description}
        />
      </div>
      <div className="form__input-wrapper">
        <label htmlFor="previewImage" className="offer-form__label">
          Preview Image
        </label>
        <input
          className="form__input offer-form__text-input"
          type="file"
          placeholder="Preview image"
          name={FormFieldName.previewImage}
          id="previewImage"
          required={isCreate}
        />
      </div>
      <fieldset className="images-fieldset">
        {Array.from(new Array(6), (_, i) => i + 1).map((key, index) => (
          <div key={key} className="form__input-wrapper">
            <label htmlFor={`image=${index}`} className="offer-form__label">
          Offer Image #{key}
            </label>
            <input
              className="form__input offer-form__text-input"
              type="file"
              placeholder="Offer image"
              name={`image[${key}]`}
              id={`image-${index}`}
              required={isCreate}
            />
          </div>
        ))}

      </fieldset>
      <fieldset className="type-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="type" className="type-fieldset__label">
            Type
          </label>
          <Select
            className="type-fieldset__select"
            classNamePrefix="react-select"
            name={FormFieldName.type}
            onChange={handleTypeChange}
            id="type"
            defaultValue={{ value: type, label: capitalize(type) }}
            options={TYPES.map((typeItem) => ({
              value: typeItem,
              label: capitalize(typeItem),
            }))}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="price" className="type-fieldset__label">
            Price
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="100"
            name={FormFieldName.price}
            id="price"
            defaultValue={price}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="bedrooms" className="type-fieldset__label">
            Bedrooms
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.bedrooms}
            id="bedrooms"
            required
            step={1}
            defaultValue={bedrooms}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="maxAdults" className="type-fieldset__label">
            Max adults
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.maxAdults}
            id="maxAdults"
            required
            step={1}
            defaultValue={maxAdults}
          />
        </div>
      </fieldset>
      <fieldset className="goods-list">
        <h2 className="goods-list__title">Goods</h2>
        <ul className="goods-list__list">
          {GOODS.map((good) => (
            <li key={good} className="goods-list__item">
              <input
                type="checkbox"
                id={good}
                name={`${FormFieldName.good}${good}`}
                defaultChecked={chosenGoods.includes(good)}
              />
              <label className="goods-list__label" htmlFor={good}>
                {good}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form__input-wrapper location-picker">
        <label htmlFor="cityName" className="location-picker__label">
          Location
        </label>
        <Select
          className="location-picker__select"
          classNamePrefix="react-select"
          name={FormFieldName.cityName}
          id="cityName"
          defaultValue={{ value: city.name, label: city.name }}
          options={CITIES.map((cityItem) => ({
            value: cityItem,
            label: cityItem,
          }))}
          onChange={(evt) => {
            if (evt) {
              handleCityChange(evt.value);
            }
          }}
        />
      </div>
      <LocationPicker
        city={chosenCity}
        onChange={handleLocationChange}
        location={chosenLocation}
      />
      <button className="form__submit button" type="submit">
        Save
      </button>
    </form>
  );
};

export default OfferForm;
