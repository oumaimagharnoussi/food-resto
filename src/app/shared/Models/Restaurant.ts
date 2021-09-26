import Speciality from './Speciality';
import RestaurantOwner from './RestaurantOwner';
import Address from './Address';

export default class Restaurant{
    name: string;
    minPrice: number; 
    dureeLivraison: string;
    logo: string;
    nbreLivreur: number;
    delivery: string;
    prixMinLivraison: number;
    speciality:string;
    description: string;
    restaurantOwner:string
    currency:any;
    restaurantTel:any;
    businessAddress:Address
  }
  