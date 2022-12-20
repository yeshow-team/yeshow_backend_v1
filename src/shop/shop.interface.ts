export interface IShop {
  shop_name: string;
  shop_category: string;
  shop_image: string;
  business_registration_image: string;
  business_registration_certificate_image: string;
  shop_type?: number;
  shop_rating?: number;
  shop_like?: number;
}

export interface IShopDetail {
  shop_uuid?: string;
  shop_address: string;
  shop_tell: string;
  business_hours: string;
  closed_days: string;
  shop_description: string;
}

export interface IMenu {
  shop_uuid?: string;
  shop_menu_name: string;
  shop_menu_description: string;
  shop_menu_price: number;
  shop_menu_image: string;
  shop_menu_type?: number;
}

export interface IShopAndMenus {
  shop: IShop;
  shop_detail: IShopDetail;
  menus: IMenu[];
}
