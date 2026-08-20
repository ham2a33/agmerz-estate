"use client";

import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { FavoritesHero } from "@/components/favorites/FavoritesHero";
import { FavoritesEmptyState } from "@/components/favorites/FavoritesEmptyState";
import { FavoritesGrid, FavoritesGridSkeleton } from "@/components/favorites/FavoritesGrid";
import { FavoritesFinalCta } from "@/components/favorites/FavoritesFinalCta";
import { getObjectCountLabel } from "@/lib/favorites-data";
import { FAVORITES_CHANGED_EVENT, pruneInvalidFavorites } from "@/lib/favorites";
import type { PageHeroConfig } from "@/types/pages";
import type { ImageSlotValue } from "@/lib/image-slots/types";
import type { Property } from "@/types";

type FavoritesState =
  | { status: "loading" }
  | { status: "ready"; properties: Property[] };

async function fetchPublicProperties(): Promise<Property[]> {
  const response = await fetch("/api/properties");
  const data = await response.json();

  if (!response.ok || !data.success || !Array.isArray(data.data)) {
    return [];
  }

  return data.data as Property[];
}

function resolveFavoriteProperties(ids: string[], properties: Property[]): Property[] {
  const propertyMap = new Map(properties.map((property) => [property.id, property]));

  return ids
    .map((id) => propertyMap.get(id))
    .filter((property): property is Property => property !== undefined);
}

export function FavoritesContent({
  hero,
  emptyStateImage,
}: {
  hero: PageHeroConfig;
  emptyStateImage: ImageSlotValue;
}) {
  const [state, setState] = useState<FavoritesState>({ status: "loading" });

  const refreshFavorites = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const properties = await fetchPublicProperties();
      const validIds = properties.map((property) => property.id);
      const favoriteIds = pruneInvalidFavorites(validIds);
      setState({
        status: "ready",
        properties: resolveFavoriteProperties(favoriteIds, properties),
      });
    } catch {
      setState({ status: "ready", properties: [] });
    }
  }, []);

  useEffect(() => {
    void refreshFavorites();

    function handleFavoritesChange() {
      void refreshFavorites();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === "agmerz_favorites" || event.key === null) {
        void refreshFavorites();
      }
    }

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshFavorites]);

  const isLoading = state.status === "loading";
  const properties = state.status === "ready" ? state.properties : [];
  const count = properties.length;

  return (
    <>
      <FavoritesHero hero={hero} />

      <section className="section-padding pt-10 md:pt-12">
        <Container>
          <div className="mb-8 md:mb-10">
            <h2 className="font-serif text-2xl text-foreground md:text-3xl">Избранные объекты</h2>
            {isLoading ? (
              <div className="mt-2 h-5 w-28 animate-pulse rounded bg-surface-muted" />
            ) : (
              <p className="mt-2 text-sm text-muted">
                {count} {getObjectCountLabel(count)}
              </p>
            )}
          </div>

          {isLoading && <FavoritesGridSkeleton />}

          {!isLoading && count === 0 && (
            <FavoritesEmptyState
              imageUrl={emptyStateImage.url}
              imageAlt={emptyStateImage.alt || "Избранное AGMERZ ESTATE"}
            />
          )}

          {!isLoading && count > 0 && (
            <>
              <FavoritesGrid properties={properties} />
              <FavoritesFinalCta />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
