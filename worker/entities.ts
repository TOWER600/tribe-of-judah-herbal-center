import { IndexedEntity } from "./core-utils";
import type { Product, Branch, Sale } from "@shared/types";
import { MOCK_PRODUCTS, MOCK_BRANCHES, MOCK_SALES } from "@shared/mock-data";
export class BranchEntity extends IndexedEntity<Branch> {
  static readonly entityName = "branch";
  static readonly indexName = "branches";
  static readonly initialState: Branch = { id: "", name: "", location: "" };
  static seedData = MOCK_BRANCHES;
}
export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = { 
    id: "", 
    sku: "", 
    name: "", 
    category: "", 
    retailPrice: 0, 
    wholesalePrice: 0, 
    totalStock: 0, 
    unit: "", 
    expiryDate: "" 
  };
  static seedData = MOCK_PRODUCTS;
}
export class SaleEntity extends IndexedEntity<Sale> {
  static readonly entityName = "sale";
  static readonly indexName = "sales";
  static readonly initialState: Sale = {
    id: "",
    branchId: "",
    branchName: "",
    timestamp: 0,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'cash',
    pricingMode: 'retail'
  };
  static seedData = MOCK_SALES;
}