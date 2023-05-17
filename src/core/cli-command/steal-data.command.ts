import {CliCommandInterface} from './cli-command.interface.js';
import got from 'got';
import {ACADEMY_URL, DefaultConfig} from '../cli-consts/consts.js';

type OFFER = {
  description: string,
  title: string,
  images: string[]
};

export default class StealDataCommand implements CliCommandInterface {
  private offers: OFFER[] | undefined;
  public readonly name = '--steal';
  public async execute(): Promise<void> {
    try {
      this.offers = await got.get(ACADEMY_URL).json() as OFFER[];
    } catch {
      console.log(`Can't fetch data from ${ACADEMY_URL}.`);
      return;
    }
    const titles = Array.from(new Set(this.offers?.map((offer) => offer.title)));
    const descriptions = Array.from(new Set(this.offers?.map((offer) => offer.description)));
    const images = Array.from(new Set(this.offers.map((offer) =>
      offer.images).reduce((acc, image) => acc.concat(image))));
    const ob = {titles, descriptions, images};
    console.log(ob);
    got.post(`${DefaultConfig.jsonURL}/${DefaultConfig.offersEnd}`,{
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(ob)
    });
  }
}
