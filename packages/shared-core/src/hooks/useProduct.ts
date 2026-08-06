"use client";
import useSWR from "swr";
import type { Product } from "../product";
import { productApi } from "../api/productApi";

const SWR_KEY = "/api/products";

export function useProduct() {
  const {
    data: productData = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<Product[]>(SWR_KEY, () => productApi.list());

  const getAllProducts = () => mutate();

  const createProduct = async (
    newProduct: Omit<Product, "id">
  ): Promise<Product | null> => {
    const tempId = -Date.now();
    const optimisticItem: Product = { ...(newProduct as Product), id: tempId };

    try {
      await mutate(
        async (current: Product[] = []) => {
          const created = await productApi.create(newProduct);
          return [...current.filter((p) => p.id !== tempId), created];
        },
        {
          optimisticData: (current: Product[] = []) => [...current, optimisticItem],
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return newProduct as Product;
    } catch {
      return null;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await mutate(
        async (current: Product[] = []) => {
          await productApi.remove(id);
          return current.filter((p) => p.id !== id);
        },
        {
          optimisticData: (current: Product[] = []) =>
            current.filter((p) => p.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      return null;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await mutate(
        async (current: Product[] = []) => {
          const updated = await productApi.update(product);
          return current.map((p) => (p.id === product.id ? updated : p));
        },
        {
          optimisticData: (current: Product[] = []) =>
            current.map((p) => (p.id === product.id ? product : p)),
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      return null;
    }
  };

  const uploadProductImage = async (jpegFile: File): Promise<string | null> => {
    try {
      return await productApi.uploadImage(jpegFile);
    } catch {
      return null;
    }
  };

  return {
    productData,
    loading,
    error,
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage,
  };
}
