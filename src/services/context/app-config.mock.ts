import { IAppConfig } from './app-config';

const apiBasePath = 'apiproducts';
const appBasePath = 'products';
const gtmAppName = 'ProductsSPA';
const version = '2017.04.12.0';
const gtmErrorCategory = 'productErrorCategory';
export const mockAppConfig: IAppConfig = {
    apiBasePath: apiBasePath,
    appBasePath: appBasePath,
    appVersion: version,
    gtmAppName: gtmAppName,
    gtmErrorCategory: gtmErrorCategory
};
