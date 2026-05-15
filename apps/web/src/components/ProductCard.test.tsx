import { render, screen } from "@testing-library/react";
import { getProductBySlug } from "@creator-print-ai/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
  }: {
    src: string | { src: string };
    alt: string;
  }) => <img src={typeof src === "string" ? src : src.src} alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("ProductCard", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("shows the product-specific mockup for the product title", () => {
    const product = getProductBySlug("flyers");
    expect(product).toBeDefined();

    render(<ProductCard product={product!} />);

    expect(
      screen.getByAltText("Flyers high-resolution print product mockup"),
    ).toHaveAttribute("src", "/assets/products/flyers.webp");
    expect(screen.queryByText("Chef")).not.toBeInTheDocument();
  });
});
