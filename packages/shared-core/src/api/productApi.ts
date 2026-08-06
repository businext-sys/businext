import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Product } from "../product";

const PATH = "/api/products";

function mapProductFromApi(data: Record<string, unknown>): Product {
  return {
    id: data.id as number,
    name: data.name as string,
    price: data.price as number,
    type: data.type as string | undefined,
    imageUrl: data.image_url as string | undefined,
    seller: data.seller as string | undefined,
  };
}

function mapProductToApi(product: Omit<Product, "id">) {
  return {
    name: product.name,
    price: product.price,
    type: product.type ?? null,
    image_url: product.imageUrl ?? null,
    seller: product.seller ?? null,
  };
}

export const productApi = {
  list: (client: ApiClient = apiClient): Promise<Product[]> =>
    client.get<Record<string, unknown>[]>(PATH).then((data) => data.map(mapProductFromApi)),

  create: async (
    product: Omit<Product, "id">,
    client: ApiClient = apiClient
  ): Promise<Product> => {
    const data = await client.post<Record<string, unknown>>(
      PATH,
      mapProductToApi(product)
    );
    return mapProductFromApi(data);
  },

  update: async (
    product: Product,
    client: ApiClient = apiClient
  ): Promise<Product> => {
    const { id, ...rest } = product;
    const data = await client.patch<Record<string, unknown>>(
      `${PATH}?id=${id}`,
      mapProductToApi(rest)
    );
    return mapProductFromApi(data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.delete(`${PATH}?id=${id}`),

  /**
   * Sube la imagen ya convertida a JPEG (la conversion en si —
   * `convertToJpeg`— sigue en apps/web porque usa APIs de Canvas del
   * navegador, no portables a mobile sin una libreria equivalente).
   */
  uploadImage: async (
    jpegFile: File | Blob,
    client: ApiClient = apiClient
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", jpegFile);
    const response = await client.raw("/api/products/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Error al subir la imagen");
    }
    return data.url as string;
  },
};
