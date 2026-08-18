import { generatePropertySlug } from "@/lib/property-form";
import type { Category } from "@/types";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: string;
}

export const EMPTY_CATEGORY_FORM: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: "1",
};

export function generateCategorySlug(name: string): string {
  return generatePropertySlug(name);
}

export function categoryToFormValues(category: Category): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image ?? "",
    isActive: category.isActive,
    sortOrder: String(category.sortOrder),
  };
}

export function formValuesToCategoryInput(values: CategoryFormValues) {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim(),
    image: values.image.trim() || null,
    isActive: values.isActive,
    sortOrder: values.sortOrder.trim() ? Number(values.sortOrder) : 1,
  };
}

export function validateCategoryForm(values: CategoryFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) errors.name = "Укажите название";
  if (!values.slug.trim()) errors.slug = "Укажите slug";

  if (values.sortOrder.trim() && Number.isNaN(Number(values.sortOrder))) {
    errors.sortOrder = "Укажите корректный порядок";
  }

  return errors;
}
