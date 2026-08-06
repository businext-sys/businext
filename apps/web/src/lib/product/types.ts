import { UseFormRegister } from "react-hook-form";
import type { Product } from "@businext/shared-core";

export type { Product };

export type ProductInputProps = {
  register: UseFormRegister<Product>;
  index?: number;
};
