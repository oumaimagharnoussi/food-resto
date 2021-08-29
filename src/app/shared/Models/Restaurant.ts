import Speciality from './Speciality';
import RestaurantOwner from './RestaurantOwner';

export default class Restaurant{
    name: string;
    minPrice: number; 
    dureeLivraison: string;
    logo: string;
    country: string;
    route: string;
    locality: string;
    nbreLivreur: number;
    delivery: string;
    prixMinLivraison: number;
    postalCode: string;
    administrativeAreaLevel1: string;
    streetNumber: number;
    specialities:[Speciality];
  description: string;
  restaurantOwner:string
  currency:any;
  
  }
  